"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TextFlipProps {
  children: ReactNode;
  className?: string;
}

export function TextFlip({ children, className }: TextFlipProps) {
  return (
    <span className="group/flip relative inline-flex overflow-hidden">
      <span
        className={cn(
          "inline-flex transition-transform duration-300 ease-out group-hover/flip:-translate-y-full",
          className
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "absolute left-0 top-0 inline-flex translate-y-full transition-transform duration-300 ease-out group-hover/flip:translate-y-0",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}
