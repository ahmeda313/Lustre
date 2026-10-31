"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  meta?: string;
  metaTone?: "default" | "brass";
};

type Props<T extends string> = {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  tone?: "dark" | "light";
  size?: "default" | "compact";
  className?: string;
  itemsClassName?: string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onValueChange,
  tone = "dark",
  size = "default",
  className,
  itemsClassName,
}: Props<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as T);
      }}
      aria-label={label}
      className={cn(
        "flex w-full border",
        tone === "dark" ? "border-hairline-dark" : "border-hairline-light",
        className,
      )}
    >
      {options.map((option, index) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-2 transition-colors duration-ui ease-luxe",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-brass after:opacity-0 after:transition-opacity after:duration-ui after:ease-luxe after:content-['']",
            "data-[state=on]:after:opacity-100",
            "focus-visible:z-10",
            index > 0 &&
              (tone === "dark" ? "border-l border-hairline-dark" : "border-l border-hairline-light"),
            size === "default" ? "px-4 py-5" : "px-3 py-3.5",
            tone === "dark"
              ? "text-stone hover:bg-bone/[0.045] data-[state=on]:bg-bone data-[state=on]:text-ink"
              : "text-stone-ink hover:bg-ink/[0.04] data-[state=on]:bg-ink data-[state=on]:text-bone",
            itemsClassName,
          )}
        >
          {option.icon ? (
            <span className="flex h-8 w-full items-center justify-center">{option.icon}</span>
          ) : null}
          <span className="text-center font-sans text-[13px] font-medium leading-tight tracking-[0.01em]">
            {option.label}
          </span>
          {option.meta ? (
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.12em]",
                option.metaTone === "brass"
                  ? cn(
                      "border border-brass/70 px-1.5 py-0.5 group-data-[state=on]:text-brass",
                      tone === "dark" ? "text-brass" : "text-ink",
                    )
                  : "opacity-60",
              )}
            >
              {option.meta}
            </span>
          ) : null}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
