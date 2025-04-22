"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { X, Download, FileIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";

interface FileViewerProps {
  fileId: Id<"uploads"> | null;
  onClose: () => void;
}

export default function FileViewer({ fileId, onClose }: FileViewerProps) {
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  const fileDetails = useQuery(
    api.files.getFileDetails,
    fileId ? { fileId } : "skip"
  );

  const fileUrlFromApi = useQuery(
    api.files.getFileUrl,
    fileId && fileDetails ? { storageId: fileDetails.storageId } : "skip"
  );

  useEffect(() => {
    if (fileUrlFromApi) {
      setLocalFileUrl(fileUrlFromApi);
    }
  }, [fileUrlFromApi]);

  useEffect(() => {
    return () => {
      if (localFileUrl && localFileUrl.startsWith("blob:")) {
        URL.revokeObjectURL(localFileUrl);
      }
    };
  }, [fileId, localFileUrl]);

  const fileUrl = useQuery(
    api.files.getFileUrl,
    fileDetails?.storageId ? { storageId: fileDetails.storageId } : "skip"
  );

  if (!fileId) return null;

  return (
    <AnimatePresence>
      {fileId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-card dark:bg-card/90 border border-border rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {fileDetails ? (
                <div className="min-w-0">
                  <h3 className="font-semibold truncate max-w-[280px] sm:max-w-[400px]">
                    {fileDetails.filename}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Uploaded on{" "}
                    {format(
                      parseISO(fileDetails.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              ) : (
                <div className="h-10 flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading file details...</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                {fileDetails && fileUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => window.open(fileUrl, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden xs:inline">Download</span>
                  </Button>
                )}

                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-2 sm:p-4 relative min-h-[200px]">
              {!fileDetails || !localFileUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <RenderFileContent
                  fileUrl={localFileUrl}
                  contentType={fileDetails.contentType}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RenderFileContent({
  fileUrl,
  contentType,
}: {
  fileUrl: string;
  contentType: string;
}) {
  if (contentType.startsWith("image/")) {
    return (
      <div className="flex items-center justify-center h-full">
        <Image
          src={fileUrl}
          alt="File preview"
          width={800}
          height={600}
          className="max-w-full max-h-[60vh] object-contain rounded-md"
          unoptimized
        />
      </div>
    );
  } else if (contentType.startsWith("video/")) {
    return (
      <div className="flex items-center justify-center h-full">
        <video
          src={fileUrl}
          controls
          className="max-w-full max-h-[60vh] rounded-md w-full sm:w-auto"
        />
      </div>
    );
  } else if (contentType.startsWith("audio/")) {
    return (
      <div className="flex items-center justify-center h-full py-4 px-2 sm:p-4">
        <audio src={fileUrl} controls className="w-full" />
      </div>
    );
  } else if (contentType === "application/pdf") {
    return (
      <div className="h-[60vh] w-full">
        <iframe
          src={fileUrl}
          className="w-full h-full border-0 rounded-md"
          title="PDF preview"
        />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8">
        <div className="p-4 sm:p-6 bg-muted/30 rounded-full mb-4">
          <FileIcon className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
          This file type ({contentType}) cannot be previewed directly.
        </p>
        <Button
          onClick={() => window.open(fileUrl, "_blank")}
          className="gap-1.5"
          size="sm"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          <span>Download File</span>
        </Button>
      </div>
    );
  }
}
