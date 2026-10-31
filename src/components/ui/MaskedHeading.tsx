"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  animateOnMount?: boolean;
  delay?: number;
  stagger?: number;
  id?: string;
};

export function MaskedHeading({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  animateOnMount = false,
  delay = 0,
  stagger = 0.08,
  id,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const active = animateOnMount || inView;

  return (
    <Tag id={id} className={cn("font-display font-normal", className)}>
      <span ref={ref} className="block">
        {lines.map((line, index) => (
          <span key={index} className={cn("mask-line", lineClassName)}>
            <motion.span
              className="block will-change-transform"
              initial={{ y: "112%" }}
              animate={active ? { y: "0%", opacity: 1 } : { y: "112%" }}
              transition={{
                duration: reduce ? 0.001 : 0.88,
                delay: reduce ? 0 : delay + index * stagger,
                ease: EASE,
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
