import { cn } from "@/lib/cn";

type Props = {
  number: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
};

export function Eyebrow({ number, label, tone = "dark", className }: Props) {
  return (
    <div className={cn("label flex items-center gap-2", className)}>
      <span className="text-brass">{number}</span>
      <span className={tone === "dark" ? "text-stone" : "text-stone-ink"}>/ {label}</span>
    </div>
  );
}
