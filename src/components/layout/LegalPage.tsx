import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Section = {
  heading: string;
  body: ReactNode;
};

type Props = {
  number: string;
  label: string;
  title: ReactNode;
  intro: string;
  updated: string;
  sections: Section[];
  footnote?: ReactNode;
};

export function LegalPage({
  number,
  label,
  title,
  intro,
  updated,
  sections,
  footnote,
}: Props) {
  return (
    <section className="grain bg-obsidian pb-24 pt-[calc(var(--nav-height)+64px)] lg:pb-32 lg:pt-[calc(var(--nav-height)+112px)]">
      <div className="container-x">
        <Eyebrow number={number} label={label} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h1 className="text-h2 text-bone">{title}</h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-[38ch] text-body text-stone">{intro}</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
              Last updated {updated}
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-hairline-dark lg:mt-20">
          {sections.map((section, index) => (
            <section
              key={section.heading}
              className="grid grid-cols-1 gap-6 border-b border-hairline-dark py-10 md:grid-cols-12 md:gap-6 lg:py-12"
            >
              <span className="label text-stone md:col-span-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-[clamp(26px,2.6vw,34px)] leading-tight tracking-[-0.01em] text-bone md:col-span-3">
                {section.heading}
              </h2>
              <div className="max-w-[62ch] space-y-4 text-body leading-relaxed text-stone md:col-span-6 md:col-start-7">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        {footnote ? (
          <p className="mt-10 max-w-[70ch] text-sm leading-relaxed text-stone">
            {footnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
