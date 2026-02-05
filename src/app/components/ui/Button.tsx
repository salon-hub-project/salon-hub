import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from "../AppIcon";
import * as LucideIcons from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#F9F5F7] text-[#2E1A25] hover:bg-primary hover:text-white shadow-sm hover:shadow-md",

        secondary:
          "bg-[#F3E8F1] text-[#4A2C3A] hover:bg-primary hover:text-white",

        outline:
          "border border-primary/40 text-primary bg-white hover:bg-primary hover:text-white",

        ghost:
          "bg-transparent text-primary hover:bg-primary/10 hover:text-primary",

        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",

        success:
          "bg-[#E6F4EA] text-[#1E6B3A] hover:bg-[#34A853] hover:text-white",

        warning:
          "bg-[#FFF6E0] text-[#8A5B00] hover:bg-[#F4B400] hover:text-white",

        danger:
          "bg-[#FDECEC] text-[#B3261E] hover:bg-[#D93025] hover:text-white",

        destructive:
          "bg-[#FADCDC] text-[#8B1E1E] hover:bg-[#C62828] hover:text-white",
      },

      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-10",
        icon: "h-10 w-10",
        xs: "h-8 px-2 text-xs",
        xl: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconName?: keyof typeof LucideIcons | null;
  iconPosition?: "left" | "right";
  iconSize?: number | null;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      loading = false,
      iconName = null,
      iconPosition = "left",
      iconSize = null,
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap: Record<NonNullable<ButtonProps["size"]>, number> = {
      xs: 12,
      sm: 14,
      default: 16,
      lg: 18,
      xl: 20,
      icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap[size || "default"] || 16;

    // Loading spinner component
    const LoadingSpinner: React.FC = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const renderIcon = (): React.ReactNode => {
      if (!iconName) return null;
      try {
        return (
          <Icon
            name={iconName}
            size={calculatedIconSize}
            className={cn(
              children && iconPosition === "left" && "mr-2",
              children && iconPosition === "right" && "ml-2",
            )}
          />
        );
      } catch {
        return null;
      }
    };

    const renderFallbackButton = (): React.ReactElement => (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full",
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {iconName && iconPosition === "left" && renderIcon()}
        {children}
        {iconName && iconPosition === "right" && renderIcon()}
      </button>
    );

    // When asChild is true, merge icons into the child element
    if (asChild) {
      try {
        if (!children || React.Children.count(children) !== 1) {
          return renderFallbackButton();
        }

        const child = React.Children.only(children);

        if (!React.isValidElement(child)) {
          return renderFallbackButton();
        }

        const content = (
          <>
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === "left" && renderIcon()}
            {"props" in (child as React.ReactElement<any>) &&
              (child as React.ReactElement<any>).props?.children}
            {iconName && iconPosition === "right" && renderIcon()}
          </>
        );

        const clonedChild = React.cloneElement(
          child as React.ReactElement<any>,
          {
            className: cn(
              buttonVariants({ variant, size, className }),
              fullWidth && "w-full",
              React.isValidElement(child) && "className" in (child.props as any)
                ? (child.props as any).className
                : undefined,
            ),
            disabled:
              disabled ||
              loading ||
              (child.props &&
              typeof child.props === "object" &&
              "disabled" in child.props
                ? child.props.disabled
                : undefined),
            children: content,
          },
        );

        return (
          <Comp ref={ref} {...props}>
            {clonedChild}
          </Comp>
        );
      } catch {
        return renderFallbackButton();
      }
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full",
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {iconName && iconPosition === "left" && renderIcon()}
        {children}
        {iconName && iconPosition === "right" && renderIcon()}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
