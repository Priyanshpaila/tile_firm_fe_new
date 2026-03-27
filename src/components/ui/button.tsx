import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; };

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[var(--button-primary)] text-white hover:bg-[var(--button-primary-hover)]",
        variant === "secondary" && "border border-[var(--border-soft)] bg-white/70 text-[var(--text-primary)] hover:bg-white",
        variant === "ghost" && "bg-transparent text-[var(--text-primary)] hover:bg-white/40",
        variant === "danger" && "bg-[var(--danger)] text-white hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}
