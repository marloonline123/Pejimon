import React from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InviteItemProps {
  email: string;
  role: string;
  onRemove: (email: string) => void;
}

export function InviteItem({ email, role, onRemove }: InviteItemProps) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-rich-cerulean-500/10 text-rich-cerulean-500 flex items-center justify-center font-bold text-xs">
          {email.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm">{email}</p>
          <Badge variant="outline" className="text-[10px] capitalize">
            {role}
          </Badge>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(email)}
        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
