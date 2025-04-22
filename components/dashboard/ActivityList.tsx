"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { FileIcon, File, Download, FileText, FileImage, FileVideo, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

interface Activity {
  _id: Id<"uploads">;
  storageId: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
}

interface ActivityListProps {
  activities: Activity[];
  onViewFile: (fileId: Id<"uploads">) => void;
}

export default function ActivityList({ activities, onViewFile }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No activity on this day</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={String(activity._id)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-card dark:bg-black/40 border border-border/40 hover:border-border/70 dark:hover:border-border/50 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <div className="p-2 rounded-md bg-primary/10 dark:bg-primary/20">
              <GetFileIcon contentType={activity.contentType} />
            </div>
            <div>
              <h4 className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{activity.filename}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span>{formatFileSize(activity.size)}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span>{format(parseISO(activity.createdAt), "h:mm a")}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 gap-1.5 hover:bg-primary/10"
              onClick={() => onViewFile(activity._id)}
            >
              <File className="h-4 w-4" />
              <span>View</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 gap-1.5 hover:bg-primary/5"
              onClick={() => window.open(`/api/download/${activity.storageId}`, "_blank")}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GetFileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith("image/")) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  } else if (contentType.startsWith("video/")) {
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  } else if (contentType.startsWith("audio/")) {
    return <FileAudio className="h-5 w-5 text-amber-500" />;
  } else if (contentType.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  } else if (contentType.includes("spreadsheet") || contentType.includes("excel")) {
    return <FileText className="h-5 w-5 text-green-500" />;
  } else if (contentType.includes("document") || contentType.includes("word")) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else {
    return <FileIcon className="h-5 w-5 text-slate-500" />;
  }
}
