"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LogoUploaderProps {
  logoPreview: string | null;
  onLogoChange: (file: File | null, previewUrl: string | null) => void;
}

export function LogoUploader({ logoPreview, onLogoChange }: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onLogoChange(file, previewUrl);
    }
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onLogoChange(null, null);
  };

  return (
    <div className="space-y-2">
      <Label>Organization Logo (Optional)</Label>
      <div className="flex items-center space-x-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-2xl border-2 border-dashed border-border hover:border-rich-cerulean-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/40 overflow-hidden relative group"
        >
          {logoPreview ? (
            <Image
              src={logoPreview}
              alt="Logo preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground group-hover:text-rich-cerulean-500">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-[10px]">Upload</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Click to upload a brand logo</p>
          <p>PNG, JPG or SVG up to 5MB.</p>
          {logoPreview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={handleRemove}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
