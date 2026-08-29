import React from "react";
import { Badge } from "@/components/ui/badge";

interface TeamItemProps {
  name: string;
  description?: string;
}

export function TeamItem({ name, description }: TeamItemProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-rich-cerulean-500/10 text-rich-cerulean-500 flex items-center justify-center font-bold text-xs">
          {name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          {description && (
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {description}
            </p>
          )}
        </div>
      </div>
      <Badge variant="outline" className="text-[10px]">
        Created
      </Badge>
    </div>
  );
}
