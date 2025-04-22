
export interface UploadItem {
  createdAt: string;
  contentType: string;
  id?: string;
  name?: string;
  size?: number;
  userId?: string;
  fileId?: string;
  url?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ActiveDay {
  date: Date;
  count: number;
}

export interface FileTypeInfo {
  type: string;
  count: number;
}
  
export interface DateRange {
    start: Date;
    end: Date;
    title: string;
  }
  
export interface DailyActivityChartProps {
    uploads: UploadItem[];
    dateRange: DateRange;
    period: "week" | "month" | "year";
  }

export interface FileTypeDistributionProps {
    uploads: UploadItem[];
  }
  
export interface ChartDataItem {
    name: string;
    value: number;
  }
  
  export interface RenderActiveShapeProps {
    cx: number;
    cy: number;
    midAngle?: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: ChartDataItem;
    percent: number;
    value: number;
    index?: number;
    stroke?: string;
    paddingAngle?: number;
    cornerRadius?: number;
    name?: string;
    dataKey?: string;
  }
