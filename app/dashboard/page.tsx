"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  addDays,
  differenceInDays,
  endOfYear,
  format,
  getYear,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import JSConfetti from "js-confetti";
import { Calendar, Clock, Flame, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import ActivityList from "../../components/dashboard/ActivityList";
import FileViewer from "../../components/dashboard/FileViewer";
import { UploadButton } from "../../components/dashboard/UploadButton";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const { theme, resolvedTheme } = useTheme();
  const [viewingFile, setViewingFile] = useState<Id<"uploads"> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFirstUploadConfetti, setShowFirstUploadConfetti] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const previousStreakRef = useRef(0);
  const confettiRef = useRef<JSConfetti | null>(null);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      confettiRef.current = new JSConfetti();
    }
  }, []);

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");

  const uploads = useQuery(api.files.listUploads);

  useEffect(() => {
    if (uploads && uploads.length === 1 && !showFirstUploadConfetti) {
      setShowFirstUploadConfetti(true);

      if (confettiRef.current) {
        confettiRef.current.addConfetti({
          confettiNumber: 200,
          confettiColors: ["#10b981", "#059669", "#34d399", "#6ee7b7"],
        });
      }
    }
  }, [uploads, showFirstUploadConfetti]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, []);

  const activityData = useMemo(() => {
    if (!uploads) return [];

    const counts = uploads.reduce((acc: Record<string, number>, upload) => {
      const date = format(parseISO(upload.createdAt), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([date, count]) => ({
      date: parseISO(date),
      count,
    }));
  }, [uploads]);

  const { currentStreak, longestStreak, isStreakActive } = useMemo(() => {
    if (!activityData.length)
      return { currentStreak: 0, longestStreak: 0, isStreakActive: false };

    const sortedDates = activityData
      .map((item) => item.date)
      .sort((a, b) => a.getTime() - b.getTime());

    let currentStreak = 0;
    let tempStreak = 0;
    let maxStreak = 0;
    let lastDate = new Date();
    let isStreakActive = false;

    const hasActivityToday = sortedDates.some((date) => isToday(date));
    const hasActivityYesterday = sortedDates.some((date) =>
      isSameDay(date, subDays(new Date(), 1))
    );

    isStreakActive = hasActivityToday || hasActivityYesterday;

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const currentDate = sortedDates[i];

      if (i === sortedDates.length - 1) {
        tempStreak = 1;
        lastDate = currentDate;
      } else {
        const dayDifference = differenceInDays(lastDate, currentDate);

        if (dayDifference === 1) {
          tempStreak++;
        } else if (dayDifference > 1) {
          if (tempStreak > maxStreak) {
            maxStreak = tempStreak;
          }
          tempStreak = 1;
        }

        lastDate = currentDate;
      }
    }

    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }

    currentStreak = isStreakActive ? tempStreak : 0;

    return {
      currentStreak,
      longestStreak: maxStreak,
      isStreakActive,
    };
  }, [activityData]);

  useEffect(() => {
    if (
      isStreakActive &&
      (currentStreak > previousStreakRef.current ||
        previousStreakRef.current === 0)
    ) {
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 2000);
    }
    previousStreakRef.current = currentStreak;
  }, [currentStreak, isStreakActive]);

  const selectedDateActivities = useMemo(() => {
    if (!selectedDate || !uploads) return [];

    return uploads
      .filter((upload) => isSameDay(parseISO(upload.createdAt), selectedDate))
      .sort(
        (a, b) =>
          parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
      );
  }, [selectedDate, uploads]);

  const { weeks } = useMemo(() => {
    const year = selectedYear;
    const firstDayOfYear = startOfYear(new Date(year, 0, 1));
    const lastDayOfYear = endOfYear(new Date(year, 11, 31));

    const firstSunday = startOfWeek(firstDayOfYear, { weekStartsOn: 0 });

    const allWeeks = [];
    let currentDay = new Date(firstSunday);

    while (currentDay <= lastDayOfYear) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const dayYear = getYear(currentDay);
        const isCurrentYear = dayYear === year;

        week.push({
          date: new Date(currentDay),
          isCurrentYear,
          activity:
            activityData.find((d) => isSameDay(d.date, currentDay))?.count || 0,
          isSelected: selectedDate
            ? isSameDay(selectedDate, currentDay)
            : false,
        });

        currentDay = addDays(currentDay, 1);
      }

      allWeeks.push(week);
    }

    return { weeks: allWeeks };
  }, [selectedYear, activityData, selectedDate]);

  const monthLabels = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const containerWidth = Math.max(750, weeks.length * 16);
    const segmentWidth = containerWidth / 12;

    return months.map((month, index) => ({
      name: month,
      position: index * segmentWidth,
    }));
  }, [weeks]);

  const getActivityColor = (count: number) => {
    if (count === 0) {
      return isDarkMode
        ? "bg-slate-800/50"
        : "bg-slate-100 border border-slate-200";
    }
    if (count === 1) {
      return isDarkMode
        ? "bg-emerald-900/50"
        : "bg-emerald-200 border border-emerald-300";
    }
    if (count <= 3) {
      return isDarkMode
        ? "bg-emerald-800/70"
        : "bg-emerald-300 border border-emerald-400";
    }
    if (count <= 6) {
      return isDarkMode
        ? "bg-emerald-700/90"
        : "bg-emerald-400 border border-emerald-500";
    }
    return isDarkMode
      ? "bg-emerald-600"
      : "bg-emerald-500 border border-emerald-600";
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year, 10));
    setSelectedDate(null);
  };

  const totalWidth = Math.max(750, weeks.length * 16);

  return (
    <div className="min-h-screen p-4 pt-28 lg:p-8 lg:pt-32">
      <div className="container max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Activity Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track and visualize your file upload activity
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <motion.div
              className={`bg-white dark:bg-card/20 rounded-lg border ${
                isStreakActive
                  ? "border-amber-300 dark:border-amber-800/40"
                  : "border-slate-200 dark:border-border/20"
              } px-3 py-1 flex items-center gap-2`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className={`p-2 ${
                  isStreakActive
                    ? "bg-amber-100 dark:bg-amber-950/30"
                    : "bg-slate-100 dark:bg-slate-900/30"
                } rounded-full`}
                animate={
                  showStreakAnimation
                    ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, 10, -10, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.7 }}
              >
                <Flame
                  className={`h-4 w-4 ${
                    isStreakActive
                      ? "text-amber-500"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
              </motion.div>
              <div>
                <div className="flex items-baseline">
                  <span className="font-medium text-base">{currentStreak}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    day{currentStreak !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground leading-none">
                  Best: {longestStreak}
                </div>
              </div>
            </motion.div>

            <UploadButton />
          </div>
        </div>

        <div className="bg-white dark:bg-card/20 rounded-2xl border border-slate-200 dark:border-border/20 p-5 lg:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-muted-foreground" />
              Upload Activity in {selectedYear}
            </h2>

            <div className="flex items-center gap-2">
              <Select
                value={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto bg-white/50 dark:bg-black/10 rounded-lg p-4">
            <div style={{ width: `${totalWidth}px`, minWidth: "750px" }}>
              <div className="h-7 relative border-b border-slate-200/70 dark:border-border/10 mb-3 ml-11">
                {monthLabels.map((month) => (
                  <div
                    key={month.name}
                    className="absolute bottom-1 text-xs font-medium text-slate-500 dark:text-muted-foreground"
                    style={{
                      left: `${month.position}px`,
                    }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>

              <div className="flex">
                <div className="flex flex-col gap-[3px] mr-4 w-8 text-right">
                  <div className="h-4 text-xs text-slate-500 dark:text-muted-foreground">
                    Sun
                  </div>
                  <div className="h-4"></div>
                  <div className="h-4 text-xs text-slate-500 dark:text-muted-foreground">
                    Tue
                  </div>
                  <div className="h-4"></div>
                  <div className="h-4 text-xs text-slate-500 dark:text-muted-foreground">
                    Thu
                  </div>
                  <div className="h-4"></div>
                  <div className="h-4 text-xs text-slate-500 dark:text-muted-foreground">
                    Sat
                  </div>
                </div>

                <div className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map((day, dayIndex) => (
                        <TooltipProvider key={dayIndex}>
                          <Tooltip delayDuration={50}>
                            <TooltipTrigger asChild>
                              {day.isCurrentYear ? (
                                <motion.button
                                  className={`h-4 w-4 rounded-sm cursor-pointer ${getActivityColor(
                                    day.activity
                                  )} ${
                                    day.isSelected
                                      ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-background"
                                      : ""
                                  }`}
                                  onClick={() => setSelectedDate(day.date)}
                                  whileHover={{ scale: 1.3 }}
                                  whileTap={{ scale: 0.95 }}
                                  layoutId={`day-${format(day.date, "yyyy-MM-dd")}`}
                                />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                            </TooltipTrigger>
                            {day.isCurrentYear && (
                              <TooltipContent side="top" className="text-xs">
                                {day.activity === 1 ? (
                                  <span>
                                    1 activity on {format(day.date, "MMMM do")}
                                  </span>
                                ) : day.activity > 1 ? (
                                  <span>
                                    {day.activity} activities on{" "}
                                    {format(day.date, "MMMM do")}
                                  </span>
                                ) : (
                                  <span>
                                    No activity on {format(day.date, "MMMM do")}
                                  </span>
                                )}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 text-xs">
              <div className="text-slate-500 dark:text-muted-foreground">
                Less
              </div>
              <div
                className={`h-4 w-4 rounded-sm ${isDarkMode ? "bg-slate-800/50" : "bg-slate-100 border border-slate-200"}`}
              ></div>
              <div
                className={`h-4 w-4 rounded-sm ${isDarkMode ? "bg-emerald-900/50" : "bg-emerald-200 border border-emerald-300"}`}
              ></div>
              <div
                className={`h-4 w-4 rounded-sm ${isDarkMode ? "bg-emerald-800/70" : "bg-emerald-300 border border-emerald-400"}`}
              ></div>
              <div
                className={`h-4 w-4 rounded-sm ${isDarkMode ? "bg-emerald-700/90" : "bg-emerald-400 border border-emerald-500"}`}
              ></div>
              <div
                className={`h-4 w-4 rounded-sm ${isDarkMode ? "bg-emerald-600" : "bg-emerald-500 border border-emerald-600"}`}
              ></div>
              <div className="text-slate-500 dark:text-muted-foreground">
                More
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedDate ? (
            <motion.div
              key="activity-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-card/20 rounded-2xl border border-slate-200 dark:border-border/20 p-5 lg:p-6 shadow-sm"
            >
              <div className="flex items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-slate-500 dark:text-muted-foreground" />
                    Activity on {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedDateActivities.length} file
                    {selectedDateActivities.length !== 1 ? "s" : ""} uploaded
                  </p>
                </div>
              </div>

              <ActivityList
                activities={selectedDateActivities}
                onViewFile={(fileId: Id<"uploads">) => setViewingFile(fileId)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="activity-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-card/20 rounded-2xl border border-slate-200 dark:border-border/20 p-8 shadow-sm text-center"
            >
              <Info className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                Select a day to see activity
              </h3>
              <p className="text-slate-500 dark:text-muted-foreground max-w-md mx-auto">
                Click on any colored cell in the calendar above to view that
                day&apos;s upload activity
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FileViewer fileId={viewingFile} onClose={() => setViewingFile(null)} />
    </div>
  );
}
