"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "./icons";

type Variant = "primary" | "secondary";
type Tone = "dark" | "light";
type Size = "default" | "nav" | "compact";

type Props = {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit";
  className?: string;
  withArrow?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
};

const sizes: Record<Size, string> = {
  default: "h-14 min-h-[56px] px-6 text-[14px]",
  nav: "h-11 min-h-[44px] px-5 text-[13px]",
  compact: "h-12 min-h-[48px] px-5 text-[13px]",
};

export function Button({
  children,
  variant = "primary",
  tone = "dark",
  size = "default",
  href,
  onClick,
  type = "button",
  className,
  withArrow = true,
  disabled,
  ariaLabel,
}: Props) {
  const classes = cn(
    "group inline-flex select-none items-center justify-between gap-6 rounded-[2px] font-sans font-medium tracking-[0.02em] transition-colors duration-ui ease-luxe disabled:cursor-not-allowed disabled:opacity-50",
    sizes[size],
    variant === "primary" && tone === "dark" && "bg-bone text-ink hover:bg-bone/90",
    variant === "primary" && tone === "light" && "bg-ink text-bone hover:bg-carbon",
    variant === "secondary" && tone === "dark" &&
      "border border-hairline-dark text-bone hover:border-bone hover:bg-bone hover:text-ink",
    variant === "secondary" && tone === "light" &&
      "border border-hairline-light text-ink hover:border-ink hover:bg-ink hover:text-bone",
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <ArrowIcon
          size={size === "nav" ? 13 : 15}
          className="shrink-0 transition-transform duration-ui ease-luxe group-hover:translate-x-1"
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
