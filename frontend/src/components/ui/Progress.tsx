"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress percentage (0–100) */
  value?: number;
  /** Optional label */
  showLabel?: boolean;
}

export function Progress({ value = 0, showLabel = false, className, ...props }: ProgressProps) {
  return (
    <div
      className={cn(
        "relative w-full h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      <div
        className="h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
      {showLabel && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-white font-medium drop-shadow">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
