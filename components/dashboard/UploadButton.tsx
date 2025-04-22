"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveUpload = useMutation(api.files.saveUpload);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const postUrl = await generateUploadUrl();
      console.log("Upload URL:", postUrl);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = () => reject(new Error("Network error during upload"));
      });
      
      xhr.open("POST", postUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
      
      const { storageId } = await uploadPromise as { storageId: string };
      
      await saveUpload({
        storageId,
        filename: file.name,
        contentType: file.type,
        size: file.size
      });
      
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploading(false);
      }, 2000);
      
      toast("File uploaded successfully", {
        description: `"${file.name}" has been added to your activity`,
        action: {
          label: "View",
          onClick: () => console.log("View file"),
        },
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: "There was a problem uploading your file. Please try again.",
      });
      setIsUploading(false);
    }
  };
  
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      
      <Button 
        size="lg"
        className="relative overflow-hidden group"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {uploadSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Uploaded</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading {uploadProgress}%</span>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="upload-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:scale-110" />
              <span>Upload File</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isUploading && !uploadSuccess && (
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-green-500"
            initial={{ width: "0%" }}
            animate={{ width: `${uploadProgress}%` }}
          />
        )}
      </Button>
    </>
  );
}
