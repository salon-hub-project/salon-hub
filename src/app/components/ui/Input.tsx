import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  id?: string;
  iconName?: string;
  maxLength?: number;

  // ✅ ADD THIS
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      iconName,
      maxLength,

      // ✅ REMOVE custom prop from DOM
      iconPosition,

      ...props // ← ONLY valid input attributes go here
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id || reactId;

    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // Radio
    if (type === "radio") {
      return (
        <input
          type="radio"
          className={cn(
            "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
      );
    }

    // Default input
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block",
              error ? "text-destructive" : "text-foreground",
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          type={type}
          maxLength={maxLength}
          className={cn(
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          ref={ref}
          id={inputId}
          {...props}
        />

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
