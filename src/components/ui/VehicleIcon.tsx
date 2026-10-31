import type { VehicleSize } from "@/config/services";

const paths: Record<VehicleSize, { body: string; glass: string; door: string }> = {
  hatchback: {
    body:
      "M7 34C7 31.5 8.5 30 11 29.5L23 27.5L33 17C34.5 15 36.5 14 39 14L64 14C67 14 69 15 70.5 17L80 27.5L105 29.5C108 30 110 31.5 110 34V36H97A9 9 0 0 0 79 36H41A9 9 0 0 0 23 36H7V34Z",
    glass: "M38 24.5L44 17.75H63.5L69 24.5",
    door: "M56.5 18V35",
  },
  sedan: {
    body:
      "M6 34C6 31.5 8 30 10.5 29.5L29 27L41 17.5C43 15.5 45 14.5 47.5 14.5H74C77 14.5 79 15.5 81 17.5L92 27L110 28.5C113 29 115 31 115 34V36H99A9 9 0 0 0 81 36H41A9 9 0 0 0 23 36H6V34Z",
    glass: "M45 25L49.5 18H72.5L80 25",
    door: "M62 18V35",
  },
  suv: {
    body:
      "M6 33C6 30 8 28.5 10.5 28L22 25L31 14C32.5 11.5 35 10.5 38 10.5H78C81 10.5 83.5 11.5 85 14L94 25L110 27C113 27.5 115 29.5 115 32V36H99A9 9 0 0 0 81 36H41A9 9 0 0 0 23 36H6V33Z",
    glass: "M35 23L39 13.5H77L84 23",
    door: "M59.5 13.5V35",
  },
};

type Props = {
  vehicle: VehicleSize;
  className?: string;
};

export function VehicleIcon({ vehicle, className }: Props) {
  const path = paths[vehicle];
  return (
    <svg
      viewBox="0 0 121 48"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="square"
        strokeLinejoin="miter"
        vectorEffect="non-scaling-stroke"
      >
        <path d={path.body} />
        <path d={path.glass} />
        <path d={path.door} />
        <circle cx="32" cy="37.5" r="6.5" />
        <circle cx="88" cy="37.5" r="6.5" />
        <circle cx="32" cy="37.5" r="2.1" />
        <circle cx="88" cy="37.5" r="2.1" />
        <path d="M10.5 31.5h6" />
        <path d="M105 31.5h4.5" />
      </g>
    </svg>
  );
}
