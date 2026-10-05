export type ShapeKind =
  | "square"
  | "rectangle"
  | "triangle"
  | "pentagon"
  | "hexagon"
  | "circle";

export const OUTLINE = "#6b3b17";

export const PAINT = {
  red: "#ff6b6b",
  yellow: "#ffd23f",
  green: "#52c97a",
  blue: "#4dabf7",
  purple: "#b388ff",
  orange: "#ff9f43",
  pink: "#ff8fb1",
  sky: "#74c0fc",
};

export const SHAPE_COLOR: Record<ShapeKind, string> = {
  square: PAINT.yellow,
  rectangle: PAINT.green,
  triangle: PAINT.red,
  pentagon: PAINT.purple,
  hexagon: PAINT.orange,
  circle: PAINT.blue,
};

export const SHAPE_NAME: Record<ShapeKind, string> = {
  square: "Persegi",
  rectangle: "Persegi Panjang",
  triangle: "Segitiga",
  pentagon: "Segi Lima",
  hexagon: "Segi Enam",
  circle: "Lingkaran",
};

export type Pt = [number, number];

/** Titik-titik poligon beraturan. rot = sudut titik pertama (derajat). */
export function polyPoints(
  cx: number,
  cy: number,
  r: number,
  n: number,
  rot = -90,
): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((rot + (360 / n) * i) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
  });
}

export function ptsToString(points: Pt[]): string {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export function centroid(points: Pt[]): Pt {
  const x = points.reduce((s, p) => s + p[0], 0) / points.length;
  const y = points.reduce((s, p) => s + p[1], 0) / points.length;
  return [x, y];
}

/** Ikon kecil bangun datar (untuk pilihan jawaban & kartu belajar). */
/** Setengah atau seperempat lingkaran, untuk pilihan jawaban dan kartu materi. */
export function SliceIcon({
  kind,
  size = 32,
  className,
}: {
  kind: "half" | "quarter";
  size?: number;
  className?: string;
}) {
  const fill = SHAPE_COLOR.circle;
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {kind === "half" ? (
        <path
          d="M5 22 A15 15 0 0 1 35 22 Z"
          fill={fill}
          stroke={OUTLINE}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M20 20 L35 20 A15 15 0 0 0 20 5 Z"
          fill={fill}
          stroke={OUTLINE}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function ShapeIcon({
  kind,
  size = 32,
  className,
}: {
  kind: ShapeKind;
  size?: number;
  className?: string;
}) {
  const fill = SHAPE_COLOR[kind];
  const common = {
    fill,
    stroke: OUTLINE,
    strokeWidth: 2.6,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {kind === "square" && (
        <rect x="6" y="6" width="28" height="28" rx="2" {...common} />
      )}
      {kind === "rectangle" && (
        <rect x="3" y="10" width="34" height="20" rx="2" {...common} />
      )}
      {kind === "triangle" && <polygon points="20,5 36,33 4,33" {...common} />}
      {kind === "pentagon" && (
        <polygon points={ptsToString(polyPoints(20, 21.5, 16.5, 5))} {...common} />
      )}
      {kind === "hexagon" && (
        <polygon points={ptsToString(polyPoints(20, 20, 17, 6, 0))} {...common} />
      )}
      {kind === "circle" && <circle cx="20" cy="20" r="15" {...common} />}
    </svg>
  );
}
