"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 🏷️ Label Component
 * A consistent and theme-aware label for form fields.
 * Works seamlessly with Input, Select, Switch, Checkbox, etc.
 */
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Whether to mark it as required */
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-gray-700 dark:text-gray-300",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
