import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none",
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
        className
      )}
      {...props}
    />
  );
});
