import React from "react";
import { cn } from "@/lib/utils";

interface InputErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  messages?: string[] | string;
}

export function InputError({ messages, className, ...props }: InputErrorProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  if (typeof messages === "string") {
    messages = [messages];
  }

  return (
    <div
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
    >
      {messages.map((message, index) => (
        <p key={index} {...props}>
          {message}
        </p>
      ))}
    </div>
  );
}
