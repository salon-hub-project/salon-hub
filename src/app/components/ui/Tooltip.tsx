"use client";

import React from "react";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => {
  return (
    <div className="relative group inline-flex">
      {children}

      <span
        className="
          absolute z-50 -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white
          opacity-0 group-hover:opacity-100
          transition-opacity duration-0
          pointer-events-none
        "
      >
        {label}
      </span>
    </div>
  );
};

export default Tooltip;
