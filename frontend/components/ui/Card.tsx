import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  raised?: boolean;
}

export function Card({ children, className, raised = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border p-5 sm:p-6",
        raised ? "bg-surface-raised" : "bg-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
