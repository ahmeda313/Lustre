import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function ArrowIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M2.5 8h11" />
      <path d="M9.25 3.75 13.5 8l-4.25 4.25" />
    </svg>
  );
}

export function TickIcon({ size = 12, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M2.5 8.25 6 11.5l7.5-7" />
    </svg>
  );
}

export function PlusIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M8 2.5v11M2.5 8h11" />
    </svg>
  );
}

export function CloseIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function MenuIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden focusable="false" {...props}>
      <path d="M2 6.5h16M2 13.5h16" stroke="currentColor" strokeWidth={1.25} />
    </svg>
  );
}
