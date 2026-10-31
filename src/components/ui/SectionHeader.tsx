import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { MaskedHeading } from "./MaskedHeading";
import type { ReactNode } from "react";

type Props = {
  number: string;
  label: string;
  lines: ReactNode[];
  intro?: string;
  tone?: "dark" | "light";
  className?: string;
  headingClassName?: string;
  id?: string;
};

export function SectionHeader({
  number,
  label,
  lines,
  intro,
  tone = "dark",
  className,
  headingClassName,
  id,
}: Props) {
  return (
    <div className={cn(className)}>
      <Eyebrow number={number} label={label} tone={tone} />
      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-6">
        <MaskedHeading
          id={id}
          lines={lines}
          className={cn(
            "text-h2 lg:col-span-8",
            tone === "dark" ? "text-bone" : "text-ink",
            headingClassName,
          )}
        />
        {intro ? (
          <p
            className={cn(
              "max-w-[42ch] text-body lg:col-span-4 lg:col-start-9 lg:self-end",
              tone === "dark" ? "text-stone" : "text-stone-ink",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}
