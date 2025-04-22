"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  addDays,
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart,
  BarChart3,
  Calendar as CalendarIcon,
  Clock,
  FileType,
  Flame,
  PieChart as PieChartIcon,
  TrendingUp
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import DailyActivityChart from "@/components/analytics/DailyActivityChart";
import FileTypeDistribution from "@/components/analytics/FileTypeDistribution";
import TimeOfDayChart from "@/components/analytics/TimeOfDayChart";
import { cn } from "@/lib/utils";

interface UploadItem {
  createdAt: string;
  contentType: string;
  [key: string]: any;
}

interface ActiveDay {
  date: Date;
  count: number;
}

interface FileTypeInfo {
  type: string;
  count: number;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeStat, setActiveStat] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const uploads = useQuery(api.files.listUploads) as UploadItem[] | undefined;
  
  const dateRange = useMemo(() => {
    if (selectedPeriod === "month") {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
        title: format(currentDate, "MMMM yyyy"),
      };
    } else if (selectedPeriod === "week") {
      const start = subDays(currentDate, currentDate.getDay());
      const end = addDays(start, 6);
      return {
        start,
        end,
        title: `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`,
      };
    } else {
      const start = new Date(currentDate.getFullYear(), 0, 1);
      const end = new Date(currentDate.getFullYear(), 11, 31);
      return {
        start,
        end,
        title: format(currentDate, "yyyy"),
      };
    }
  }, [currentDate, selectedPeriod]);
  
  const filteredUploads = useMemo(() => {
    if (!uploads) return [];

    return uploads.filter((upload) => {
      const uploadDate = parseISO(upload.createdAt);
      return uploadDate >= dateRange.start && uploadDate <= dateRange.end;
    });
  }, [uploads, dateRange]);
  
  const metrics = useMemo(() => {
    if (!uploads) {
      return {
        totalUploads: 0,
        averagePerDay: 0,
        mostActiveDay: null as ActiveDay | null,
        mostActiveTime: null as string | null,
        topFileType: null as FileTypeInfo | null,
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    const totalUploads = filteredUploads.length;
    
    const dailyUploadCounts: Record<string, number> = {};
    filteredUploads.forEach((upload) => {
      const date = format(parseISO(upload.createdAt), "yyyy-MM-dd");
      dailyUploadCounts[date] = (dailyUploadCounts[date] || 0) + 1;
    });
    
    const dayCount = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    }).length;
    const averagePerDay = totalUploads / (dayCount || 1);
    
    let mostActiveDay: ActiveDay | null = null;
    let maxUploads = 0;
    Object.entries(dailyUploadCounts).forEach(([date, count]) => {
      if (count > maxUploads) {
        maxUploads = count;
        mostActiveDay = { 
          date: parseISO(date), 
          count 
        };
      }
    });
    
    const hourlyUploadCounts: Record<string, number> = {};
    filteredUploads.forEach((upload) => {
      const hour = format(parseISO(upload.createdAt), "H");
      hourlyUploadCounts[hour] = (hourlyUploadCounts[hour] || 0) + 1;
    });
    
    let mostActiveHour: number | null = null;
    let maxHourlyUploads = 0;
    Object.entries(hourlyUploadCounts).forEach(([hour, count]) => {
      if (count > maxHourlyUploads) {
        maxHourlyUploads = count;
        mostActiveHour = parseInt(hour);
      }
    });
    
    const mostActiveTime =
      mostActiveHour !== null
        ? format(new Date().setHours(mostActiveHour, 0, 0, 0), "h a")
        : null;
    
    const fileTypeCounts: Record<string, number> = {};
    filteredUploads.forEach((upload) => {
      const fileType = upload.contentType.split("/")[0] || "other";
      fileTypeCounts[fileType] = (fileTypeCounts[fileType] || 0) + 1;
    });
    
    let topFileType: FileTypeInfo | null = null;
    let maxFileTypeCount = 0;
    Object.entries(fileTypeCounts).forEach(([type, count]) => {
      if (count > maxFileTypeCount) {
        maxFileTypeCount = count;
        topFileType = { type, count };
      }
    });
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (uploads.length > 0) {
      const uniqueDates = uploads
        .map((upload) => format(parseISO(upload.createdAt), "yyyy-MM-dd"))
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((dateStr) => parseISO(dateStr))
        .sort((a, b) => b.getTime() - a.getTime());
      
      if (uniqueDates.length > 0) {
        let tempStreak = 1;
        let maxStreak = 1;
        
        const today = new Date();
        const todayFormatted = format(today, "yyyy-MM-dd");
        const yesterdayFormatted = format(subDays(today, 1), "yyyy-MM-dd");
        
        const hasUploadToday = uniqueDates.some(
          (date) => format(date, "yyyy-MM-dd") === todayFormatted
        );
        
        const hasUploadYesterday = uniqueDates.some(
          (date) => format(date, "yyyy-MM-dd") === yesterdayFormatted
        );
        
        if (hasUploadToday || hasUploadYesterday) {
          for (let i = 0; i < uniqueDates.length - 1; i++) {
            const current = uniqueDates[i];
            const next = uniqueDates[i + 1];
            const daysDifference = differenceInDays(current, next);
            
            if (daysDifference === 1) {
              tempStreak++;
            } else {
              maxStreak = Math.max(maxStreak, tempStreak);
              tempStreak = 1;
            }
          }
          
          maxStreak = Math.max(maxStreak, tempStreak);
          currentStreak = tempStreak;
        } else {
          currentStreak = 0;
          
          for (let i = 0; i < uniqueDates.length - 1; i++) {
            const current = uniqueDates[i];
            const next = uniqueDates[i + 1];
            const daysDifference = differenceInDays(current, next);
            
            if (daysDifference === 1) {
              tempStreak++;
            } else {
              maxStreak = Math.max(maxStreak, tempStreak);
              tempStreak = 1;
            }
          }
          
          maxStreak = Math.max(maxStreak, tempStreak);
        }
        
        longestStreak = maxStreak;
      }
    }
    
    return {
      totalUploads,
      averagePerDay: parseFloat(averagePerDay.toFixed(1)),
      mostActiveDay,
      mostActiveTime,
      topFileType,
      currentStreak,
      longestStreak,
    };
  }, [uploads, filteredUploads, dateRange]);
  
  const navigatePeriod = (direction: "prev" | "next") => {
    setCurrentDate((currentDate) => {
      if (selectedPeriod === "month") {
        return direction === "next"
          ? addMonths(currentDate, 1)
          : subMonths(currentDate, 1);
      } else if (selectedPeriod === "week") {
        return direction === "next"
          ? addDays(currentDate, 7)
          : subDays(currentDate, 7);
      } else {
        return direction === "next"
          ? new Date(
              currentDate.getFullYear() + 1,
              currentDate.getMonth(),
              currentDate.getDate()
            )
          : new Date(
              currentDate.getFullYear() - 1,
              currentDate.getMonth(),
              currentDate.getDate()
            );
      }
    });
  };
  
  const isCurrentPeriod = useMemo(() => {
    const today = new Date();

    if (selectedPeriod === "month") {
      return (
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()
      );
    } else if (selectedPeriod === "week") {
      const currentWeekStart = subDays(today, today.getDay());
      const selectedWeekStart = subDays(currentDate, currentDate.getDay());
      return isSameDay(currentWeekStart, selectedWeekStart);
    } else {
      return today.getFullYear() === currentDate.getFullYear();
    }
  }, [selectedPeriod, currentDate]);
  
  return (
    <div className="min-h-screen p-4 pt-28 lg:p-8 lg:pt-32" ref={containerRef}>
      <div className="container max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Activity className="h-7 w-7 text-primary" />
              Analytics Dashboard
            </motion.span>
          </h1>
          <p className="text-muted-foreground">
            Understand your file upload patterns and activity trends
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "totalUploads",
              label: "Total Uploads",
              value: metrics.totalUploads,
              icon: FileType,
              color: "bg-blue-500/20 dark:bg-blue-500/30",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              id: "averagePerDay",
              label: "Avg. Per Day",
              value: metrics.averagePerDay,
              icon: BarChart3,
              color: "bg-green-500/20 dark:bg-green-500/30",
              iconColor: "text-green-600 dark:text-green-400",
            },
            {
              id: "currentStreak",
              label: "Current Streak",
              value: metrics.currentStreak,
              suffix: "day" + (metrics.currentStreak !== 1 ? "s" : ""),
              icon: Flame,
              color: "bg-amber-500/20 dark:bg-amber-500/30",
              iconColor: "text-amber-600 dark:text-amber-400",
            },
            {
              id: "longestStreak",
              label: "Longest Streak",
              value: metrics.longestStreak,
              suffix: "day" + (metrics.longestStreak !== 1 ? "s" : ""),
              icon: TrendingUp,
              color: "bg-purple-500/20 dark:bg-purple-500/30",
              iconColor: "text-purple-600 dark:text-purple-400",
            },
          ].map((metric) => (
            <motion.div
              key={metric.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 * parseInt(metric.id.charAt(metric.id.length - 1)),
                duration: 0.5,
              }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setActiveStat(metric.id)}
              onHoverEnd={() => setActiveStat(null)}
            >
              <Card
                className={cn(
                  "p-4 border border-border/50 dark:border-border/40 h-full relative overflow-hidden group transition-all duration-300",
                  activeStat === metric.id &&
                    "shadow-md border-border/70 dark:border-border/60"
                )}
              >
                <motion.div
                  className={`absolute inset-0 opacity-0 ${metric.color} transition-opacity duration-500`}
                  animate={{ opacity: activeStat === metric.id ? 1 : 0 }}
                />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {metric.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-2xl font-bold">{metric.value}</h3>
                      {metric.suffix && (
                        <span className="text-sm text-muted-foreground">
                          {metric.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={cn("p-2 rounded-full", metric.color)}>
                    <metric.icon className={cn("h-4 w-4", metric.iconColor)} />
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/50"
                  initial={{ width: "0%" }}
                  animate={{
                    width: activeStat === metric.id ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.4 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <Tabs
            value={selectedPeriod}
            onValueChange={(val) =>
              setSelectedPeriod(val as "week" | "month" | "year")
            }
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigatePeriod("prev")}
              className="px-3 h-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="text-sm font-medium px-2 min-w-[120px] text-center">
              {dateRange.title}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigatePeriod("next")}
              disabled={isCurrentPeriod}
              className="px-3 h-9"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5 border border-border/50 dark:border-border/40 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <BarChart className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">Activity Overview</h2>
                </div>
              </div>

              {!uploads ? (
                <div className="space-y-3 p-4">
                  <Skeleton className="h-[200px] w-full" />
                </div>
              ) : (
                <DailyActivityChart
                  uploads={filteredUploads}
                  dateRange={dateRange}
                  period={selectedPeriod}
                />
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 gap-6">

              <Card className="p-5 border border-border/50 dark:border-border/40 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-primary" />
                    <h2 className="text-lg font-semibold">File Types</h2>
                  </div>
                </div>

                {!uploads ? (
                  <div className="flex justify-center items-center p-4">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                  </div>
                ) : (
                  <FileTypeDistribution uploads={filteredUploads} />
                )}
              </Card>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-5 border border-border/50 dark:border-border/40 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Upload Time Distribution
                  </h2>
                </div>
              </div>

              {!uploads ? (
                <div className="space-y-2 p-4">
                  <Skeleton className="h-[180px] w-full" />
                </div>
              ) : (
                <TimeOfDayChart uploads={filteredUploads} />
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-muted/40 dark:bg-card/20 rounded-2xl border border-border/40 dark:border-border/20 p-5 lg:p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Activity Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Most Active Day",
                value: metrics.mostActiveDay
                  ? format(metrics.mostActiveDay.date, "EEEE, MMM d")
                  : "No data",
                detail: metrics.mostActiveDay
                  ? `${metrics.mostActiveDay.count} uploads`
                  : "",
                icon: CalendarIcon,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-950/30",
              },
              {
                title: "Most Active Time",
                value: metrics.mostActiveTime || "No data",
                detail: "Based on your upload history",
                icon: Clock,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-950/30",
              },
              {
                title: "Most Common File Type",
                value: metrics.topFileType
                  ? metrics.topFileType.type
                  : "No data",
                detail: metrics.topFileType
                  ? `${metrics.topFileType.count} files`
                  : "",
                icon: FileType,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-100 dark:bg-green-950/30",
              },
            ].map((insight) => (
              <motion.div
                key={insight.title}
                className="p-4 rounded-xl border border-border/40 dark:border-border/20 bg-card dark:bg-card/40"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${insight.bg}`}>
                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {insight.title}
                    </h3>
                    <p className="text-lg font-semibold mt-1 mb-0.5">
                      {insight.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {insight.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
