import React from "react";
import { Badge } from "@/components/ui/badge";

interface RoleCardProps {
  role: {
    name: string;
    badge: string;
    desc: string;
    permissions: string[];
  };
}

export function RoleCard({ role }: RoleCardProps) {
  return (
    <div className="bg-muted/40 border border-border rounded-xl p-5 flex flex-col justify-between hover:border-rich-cerulean-500/40 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base">{role.name}</h4>
          <Badge variant="outline" className="text-xs bg-background">
            {role.badge}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {role.desc}
        </p>
      </div>

      <div className="space-y-1.5 pt-3 border-t border-border/60">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Permissions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {role.permissions.map((p) => (
            <span
              key={p}
              className="text-[11px] px-2 py-0.5 rounded-md bg-background border border-border font-medium text-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
