"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { LogoUploader } from "./LogoUploader";
import { toast } from "@/components/ui/toast";

interface StepOrganizationProps {
  isLoading: boolean;
  onSubmit: (data: { name: string; description: string; logoFile: File | null }) => Promise<void>;
}

export function StepOrganization({ isLoading, onSubmit }: StepOrganizationProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.add({ type: "error", description: "Organization name is required." });
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      logoFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rich-cerulean-500/10 text-rich-cerulean-500 mb-2">
          <Sparkles className="w-3 h-3" /> Step 1 of 4
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Create Your Organization</h2>
        <p className="text-sm text-muted-foreground">
          Your organization is the home for all your projects, teams, tasks, and files.
        </p>
      </div>

      <div className="space-y-4">
        {/* Logo Upload */}
        <LogoUploader
          logoPreview={logoPreview}
          onLogoChange={(file, previewUrl) => {
            setLogoFile(file);
            setLogoPreview(previewUrl);
          }}
        />

        {/* Org Name */}
        <div className="space-y-1.5">
          <Label htmlFor="orgName">Organization Name *</Label>
          <Input
            id="orgName"
            placeholder="e.g. Acme Studio, Nexus Inc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11"
          />
        </div>

        {/* Org Description */}
        <div className="space-y-1.5">
          <Label htmlFor="orgDescription">Description (Optional)</Label>
          <Textarea
            id="orgDescription"
            placeholder="Briefly describe what your organization or agency does..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <LoadingButton
          type="submit"
          size="lg"
          className="bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white font-semibold gap-2 shadow-md"
          isLoading={isLoading}
          loadingText="Creating Organization..."
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </LoadingButton>
      </div>
    </form>
  );
}
