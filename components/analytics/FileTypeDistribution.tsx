"use client";

import {
  FileTypeDistributionProps,
  RenderActiveShapeProps,
  ChartDataItem,
} from "@/lib/types";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";

export default function FileTypeDistribution({
  uploads,
}: FileTypeDistributionProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const [activeIndex, setActiveIndex] = useState<number | undefined>();

  const data = useMemo<ChartDataItem[]>(() => {
    const typeCounts: Record<string, number> = {};
    uploads.forEach((upload) => {
      const type = upload.contentType.split("/")[0] || "other";
      const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
      typeCounts[formattedType] = (typeCounts[formattedType] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [uploads]);

  const COLORS = isDarkMode
    ? ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#64748b"]
    : ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#64748b"];

  const renderActiveShape = (props: RenderActiveShapeProps) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 8}
          dy={8}
          textAnchor="middle"
          fill={isDarkMode ? "#e5e5e5" : "#333333"}
          fontSize={14}
          fontWeight="500"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 8}
          dy={10}
          textAnchor="middle"
          fill={isDarkMode ? "#a3a3a3" : "#555555"}
          fontSize={12}
        >
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: object, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  if (uploads.length === 0) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-2">No data available</p>
        <p className="text-sm text-muted-foreground">
          Upload files to see distribution
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[260px] flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={(props: any) =>
              renderActiveShape(props as RenderActiveShapeProps)
            }
            data={data}
            cx="50%"
            cy="50%"
            paddingAngle={3}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationDuration={800}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            iconSize={8}
            iconType="circle"
            formatter={(value: string, entry, index: number) => (
              <motion.span
                style={{
                  color: isDarkMode ? "#e5e5e5" : "#333333",
                  marginRight: "8px",
                  fontSize: 12,
                  opacity:
                    activeIndex === undefined || activeIndex === index
                      ? 1
                      : 0.5,
                }}
                animate={{
                  opacity:
                    activeIndex === undefined || activeIndex === index
                      ? 1
                      : 0.5,
                }}
              >
                {value}
              </motion.span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
