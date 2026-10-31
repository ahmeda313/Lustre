"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE } from "./MaskedHeading";

type Props = {
  value: number;
  format?: (value: number) => string;
  className?: string;
  srLabel?: string;
};

export function RollingNumber({ value, format, className, srLabel }: Props) {
  const reduce = useReducedMotion();
  const text = format ? format(value) : String(value);
  const chars = Array.from(text);

  return (
    <span className={cn("tabular", className)}>
      <span className="sr-only">{srLabel ?? text}</span>
      <span aria-hidden="true" className="inline-flex leading-[0.95]">
        {chars.map((char, index) => (
          <span key={index} className="relative inline-block">
            <span className="invisible">{char}</span>
            <span className="absolute inset-0 overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.span
                  key={char}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-105%", opacity: 0 }}
                  transition={{
                    duration: reduce ? 0.001 : 0.3,
                    ease: EASE,
                  }}
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
