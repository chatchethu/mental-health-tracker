"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * 🧩 Reusable Input component
 * Features:
 * - Full accessibility (focus rings, ARIA-safe)
 * - Dark mode support
 * - File upload styling
 * - Consistent padding and font size
 * - Tailwind + shadcn hybrid theme ready
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // 🌗 Core style
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
          // 📄 File input adjustments
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // 🎨 Placeholder and focus
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          // 🚫 Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // ✅ Dark mode polish
          "dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:ring-blue-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
