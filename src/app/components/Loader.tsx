"use client";

import clsx from "clsx";

interface LoaderProps {
  label?: string;
  className?: string;
  inline?: boolean;
  size?: "sm" | "md";
}

const Loader = ({
  label = "Loading...",
  className,
  inline = false,
  size = "md",
}: LoaderProps) => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-8 w-8";

  return (
    <div
      className={clsx(
        inline
          ? "flex items-center gap-2"
          : "flex flex-col items-center justify-center py-12 text-muted-foreground",
        className
      )}
    >
      <div
        className={clsx(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeClass
        )}
      />
      {label && <p className={inline ? "text-sm" : "mt-3 text-sm"}>{label}</p>}
    </div>
  );
};

export default Loader;
