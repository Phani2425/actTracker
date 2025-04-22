"use client";

import { UploadItem } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TimeOfDayChartProps {
  uploads: UploadItem[];
}

export default function TimeOfDayChart({ uploads }: TimeOfDayChartProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: format(new Date().setHours(i, 0, 0, 0), "h a"),
      count: 0,
    }));
    
    uploads.forEach(upload => {
      const uploadHour = parseISO(upload.createdAt).getHours();
      hours[uploadHour].count += 1;
    });
    
    return hours;
  }, [uploads]);
  
  const maxValue = Math.max(...hourlyData.map(item => item.count), 1);
  
  if (uploads.length === 0) {
    return (
      <div className="h-[180px] flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-2">No data available</p>
        <p className="text-sm text-muted-foreground">Upload files to see time distribution</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={hourlyData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDarkMode ? "#8b5cf6" : "#a855f7"} stopOpacity={0.6} />
              <stop offset="100%" stopColor={isDarkMode ? "#8b5cf6" : "#a855f7"} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            horizontal={true} 
            stroke={isDarkMode ? "#333333" : "#e5e5e5"} 
          />
          <XAxis 
            dataKey="label" 
            tick={{ fill: isDarkMode ? "#999999" : "#666666", fontSize: 12 }} 
            axisLine={{ stroke: isDarkMode ? "#444444" : "#e5e5e5" }} 
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(value, index) => {
              return index % 4 === 0 ? value : '';
            }}
          />
          <YAxis 
            tickCount={5} 
            domain={[0, maxValue > 3 ? 'auto' : 3]} 
            tick={{ fill: isDarkMode ? "#999999" : "#666666", fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card/95 dark:bg-card/95 border border-border/50 dark:border-border/40 rounded-md p-2 text-sm shadow-sm backdrop-blur-sm">
                    <p className="font-medium">{payload[0].payload.label}</p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">{payload[0].value}</span> {payload[0].value === 1 ? 'upload' : 'uploads'}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke={isDarkMode ? "#8b5cf6" : "#a855f7"} 
            fillOpacity={1}
            fill="url(#timeGradient)"
            strokeWidth={2}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
