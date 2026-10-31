import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowIcon } from "./icons";

type Props = {
  children: ReactNode;
  href: string;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
};

export function TextLink({ children, href, className, arrow = true, onClick }: Props) {
  return (
    <a href={href} onClick={onClick} className={cn("link-rule group", className)}>
      <span>{children}</span>
      {arrow ? (
        <ArrowIcon
          size={14}
          className="transition-transform duration-ui ease-luxe group-hover:translate-x-1"
        />
      ) : null}
    </a>
  );
}
