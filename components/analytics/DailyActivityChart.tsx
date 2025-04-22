"use client";

import { DailyActivityChartProps } from "@/lib/types";
import { eachDayOfInterval, eachMonthOfInterval, format, isSameDay, parseISO } from "date-fns";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function DailyActivityChart({ uploads, dateRange, period }: DailyActivityChartProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  
  const chartData = useMemo(() => {
    let intervals: Date[];
    
    if (period === "week") {
      intervals = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      
      return intervals.map(date => {
        const count = uploads.filter(upload => 
          isSameDay(parseISO(upload.createdAt), date)
        ).length;
        
        return {
          date: format(date, "EEE"),
          fullDate: format(date, "MMM dd"),
          value: count,
        };
      });
    } else if (period === "month") {
      intervals = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      
      return intervals.map(date => {
        const count = uploads.filter(upload => 
          isSameDay(parseISO(upload.createdAt), date)
        ).length;
        
        return {
          date: format(date, "d"),
          fullDate: format(date, "MMM dd"),
          value: count,
        };
      });
    } else {
      intervals = eachMonthOfInterval({ start: dateRange.start, end: dateRange.end });
      
      return intervals.map(date => {
        const startOfMonth = date;
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const count = uploads.filter(upload => {
          const uploadDate = parseISO(upload.createdAt);
          return uploadDate >= startOfMonth && uploadDate <= endOfMonth;
        }).length;
        
        return {
          date: format(date, "MMM"),
          fullDate: format(date, "MMMM yyyy"),
          value: count,
        };
      });
    }
  }, [uploads, dateRange, period]);
  
  const maxValue = Math.max(...chartData.map(item => item.value), 1);
  
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDarkMode ? "#333333" : "#e5e5e5"} 
          />
          <XAxis 
            dataKey="date" 
            tick={{ fill: isDarkMode ? "#999999" : "#666666", fontSize: 12 }} 
            axisLine={{ stroke: isDarkMode ? "#444444" : "#e5e5e5" }} 
            tickLine={false}
            dy={8}
          />
          <YAxis 
            tickCount={5} 
            domain={[0, maxValue > 5 ? 'auto' : 5]} 
            tick={{ fill: isDarkMode ? "#999999" : "#666666", fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 dark:bg-card/95 border border-border/50 dark:border-border/40 rounded-md p-2 text-sm shadow-sm backdrop-blur-sm">
                    <p className="font-medium">{payload[0].payload.fullDate}</p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{payload[0].value}</span> {payload[0].value === 1 ? 'upload' : 'uploads'}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="value" 
            fill="url(#uploadGradient)" 
            radius={[4, 4, 0, 0]} 
            barSize={period === "month" ? 8 : period === "year" ? 16 : 24}
            animationDuration={1000}
          />
          <defs>
            <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDarkMode ? "#10b981" : "#10b981"} stopOpacity={0.9} />
              <stop offset="100%" stopColor={isDarkMode ? "#059669" : "#059669"} stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
