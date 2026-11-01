import type { VehicleSize } from "@/config/services";

type Shape = {
  body: string;
  glass: string;
  door: string;
  extra: string;
  wheels: [number, number]; // x of rear and front wheel
  cy: number; // wheel centre y
  tyre: number; // tyre radius
  hub: number; // hub radius
};

const shapes: Record<VehicleSize, Shape> = {
  hatchback: {
    body: "M16 41V34C16 32.4 16.6 31.2 17.8 30.2L19.4 28.4C22.4 25 27 18.4 30.4 14.4C32.2 12.4 34 11.8 36.6 11.8H55Q60.6 11.8 64.2 14.6L78.4 25.4L94.5 27.6C99.5 28.3 102.6 29.3 104.4 31C105.8 32.3 106.2 34.2 106.2 36.6V41H95.28A9.2 9.2 0 1 0 78.72 41H43.28A9.2 9.2 0 1 0 26.72 41H16Z",
    glass: "M27.2 24.4L33.6 16.4Q34.4 15.2 36.4 15.2H54.6Q57.6 15.2 59.8 17L69.6 24.4Z",
    door: "M49.2 15.2V24.4M49.2 24.4V40",
    extra: "M16.8 31.4H20.4M101.6 31.2H105.8",
    wheels: [35, 87],
    cy: 37,
    tyre: 7,
    hub: 2.6,
  },
  sedan: {
    body: "M10 41V33.4C10 30.6 11.2 28.6 14 27.2L31 25.6L41.4 15.9Q43.4 14.2 46.4 14.2H65.6Q69.4 14.2 72 16.4L83.4 25.4L99.4 27.6C104.8 28.3 107.8 29.2 109.6 31C111 32.4 111.5 34.2 111.5 36.6V41H98.28A9.2 9.2 0 1 0 81.72 41H42.28A9.2 9.2 0 1 0 25.72 41H10Z",
    glass: "M36.6 23.8L43.6 17.4Q44.8 16.7 46.4 16.7H64.8Q67 16.7 68.8 18L77 23.8Z",
    door: "M56.4 16.7V23.8M56.4 23.8V40",
    extra: "M10.8 31.6H15M107.2 31.4H111",
    wheels: [34, 90],
    cy: 37,
    tyre: 7,
    hub: 2.6,
  },
  suv: {
    body: "M11 39V30C11 28.4 11.3 27.2 11.8 25.8L16.2 10.6Q17 8 19.6 8H76.2Q79.6 8 81.8 10.6L91 23.2L101.2 25.2Q107 26.2 109.4 28.4Q111 30 111 33V39H100.1A10.4 10.4 0 1 0 79.9 39H45.1A10.4 10.4 0 1 0 24.9 39H11Z",
    glass: "M16.4 22.6L19.6 13Q20.2 10.4 22.8 10.4H75.2Q77.2 10.4 78.6 12.2L86.6 22.6Z",
    door: "M49.4 10.4V22.6M49.4 22.6V35.2",
    extra: "M11.8 29.6H16M106.6 29.8H110.6M45.4 35.2H79.6",
    wheels: [35, 90],
    cy: 36.5,
    tyre: 7.5,
    hub: 2.8,
  },
};

type Props = {
  vehicle: VehicleSize;
  className?: string;
};

export function VehicleIcon({ vehicle, className }: Props) {
  const s = shapes[vehicle];
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
        <path d={s.body} />
        <path d={s.glass} />
        <path d={s.door} />
        <path d={s.extra} />
        {s.wheels.map((x) => (
          <g key={x}>
            <circle cx={x} cy={s.cy} r={s.tyre} />
            <circle cx={x} cy={s.cy} r={s.hub} />
          </g>
        ))}
      </g>
    </svg>
  );
}