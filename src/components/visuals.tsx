import type { ReactNode } from "react";
import {
  OUTLINE,
  PAINT,
  centroid,
  polyPoints,
  ptsToString,
  type Pt,
} from "./shapes";

export interface VisualProps {
  revealed: boolean;
}

const STROKE = {
  stroke: OUTLINE,
  strokeWidth: 4,
  strokeLinejoin: "round" as const,
};

/* ---------- Pembantu ---------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 300 230"
      className="mx-auto block h-auto w-full max-w-[280px] sm:max-w-[380px]"
      role="img"
      aria-label="Gambar bangun datar"
    >
      {children}
    </svg>
  );
}

/** Bagian bangun yang bergeser saat soal sudah dijawab. */
function Piece({
  on,
  dx = 0,
  dy = 0,
  delay = 0,
  children,
}: {
  on: boolean;
  dx?: number;
  dy?: number;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <g
      style={{
        transform: `translate(${on ? dx : 0}px, ${on ? dy : 0}px)`,
        transition: `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`,
      }}
    >
      {children}
    </g>
  );
}

/** Lapisan "utuh" yang menutupi potongan sebelum dijawab. */
function Overlay({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <g
      style={{
        opacity: show ? 1 : 0,
        transition: "opacity 0.15s",
        pointerEvents: "none",
      }}
    >
      {children}
    </g>
  );
}

function CutLine({ a, b }: { a: Pt; b: Pt }) {
  return (
    <line
      x1={a[0]}
      y1={a[1]}
      x2={b[0]}
      y2={b[1]}
      stroke="#e03131"
      strokeWidth={4}
      strokeDasharray="10 9"
      strokeLinecap="round"
    />
  );
}

function NumBadge({
  x,
  y,
  n,
  show,
  delay = 0.5,
}: {
  x: number;
  y: number;
  n: number | string;
  show: boolean;
  delay?: number;
}) {
  return (
    <g style={{ opacity: show ? 1 : 0, transition: `opacity 0.4s ${delay}s` }}>
      <circle cx={x} cy={y} r={13} fill="#fff" stroke={OUTLINE} strokeWidth={3} />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={17}
        fontWeight={700}
        fill={OUTLINE}
      >
        {n}
      </text>
    </g>
  );
}

function Tag({
  x,
  y,
  text,
  show = true,
  delay = 0.5,
  size = 18,
}: {
  x: number;
  y: number;
  text: string;
  show?: boolean;
  delay?: number;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fontWeight={700}
      fill={OUTLINE}
      stroke="#fff"
      strokeWidth={5}
      strokeLinejoin="round"
      paintOrder="stroke"
      style={{ opacity: show ? 1 : 0, transition: `opacity 0.4s ${delay}s` }}
    >
      {text}
    </text>
  );
}

/** Nomor di setiap sisi poligon (untuk menghitung sisi). */
function SideNumbers({
  pts,
  cx,
  cy,
  show,
}: {
  pts: Pt[];
  cx: number;
  cy: number;
  show: boolean;
}) {
  return (
    <>
      {pts.map((p, i) => {
        const q = pts[(i + 1) % pts.length];
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const len = Math.hypot(dx, dy);
        return (
          <NumBadge
            key={i}
            x={mx + (dx / len) * 21}
            y={my + (dy / len) * 21}
            n={i + 1}
            show={show}
            delay={0.12 * i + 0.1}
          />
        );
      })}
    </>
  );
}

/* ---------- 1. Segi lima ---------- */
export function PentagonVisual({ revealed }: VisualProps) {
  const pts = polyPoints(150, 118, 86, 5);
  return (
    <Frame>
      <polygon points={ptsToString(pts)} fill={PAINT.purple} {...STROKE} />
      <SideNumbers pts={pts} cx={150} cy={118} show={revealed} />
    </Frame>
  );
}

/* ---------- 2. Persegi dipotong diagonal -> 2 segitiga ---------- */
export function SquareCutVisual({ revealed }: VisualProps) {
  const a: Pt = [80, 45];
  const b: Pt = [220, 45];
  const c: Pt = [220, 185];
  const d: Pt = [80, 185];
  const t1 = [a, b, c];
  const t2 = [a, c, d];
  const c1 = centroid(t1);
  const c2 = centroid(t2);
  return (
    <Frame>
      <Piece on={revealed} dx={14} dy={-14}>
        <polygon points={ptsToString(t1)} fill={PAINT.blue} {...STROKE} />
        <NumBadge x={c1[0]} y={c1[1]} n={1} show={revealed} />
      </Piece>
      <Piece on={revealed} dx={-14} dy={14}>
        <polygon points={ptsToString(t2)} fill={PAINT.red} {...STROKE} />
        <NumBadge x={c2[0]} y={c2[1]} n={2} show={revealed} />
      </Piece>
      <Overlay show={!revealed}>
        <rect x={80} y={45} width={140} height={140} fill={PAINT.yellow} {...STROKE} />
        <CutLine a={a} b={c} />
      </Overlay>
    </Frame>
  );
}

/* ---------- 3. Persegi panjang dipotong tengah -> 2 persegi ---------- */
export function RectCutVisual({ revealed }: VisualProps) {
  return (
    <Frame>
      <Piece on={revealed} dx={-14}>
        <rect x={40} y={60} width={110} height={110} fill={PAINT.green} {...STROKE} />
        <Tag x={95} y={115} text="Persegi" show={revealed} size={20} />
      </Piece>
      <Piece on={revealed} dx={14}>
        <rect x={150} y={60} width={110} height={110} fill={PAINT.blue} {...STROKE} />
        <Tag x={205} y={115} text="Persegi" show={revealed} size={20} />
      </Piece>
      <Overlay show={!revealed}>
        <rect x={40} y={60} width={220} height={110} fill={PAINT.yellow} {...STROKE} />
        <CutLine a={[150, 60]} b={[150, 170]} />
      </Overlay>
    </Frame>
  );
}

/* ---------- 4. Rumah: segitiga + persegi ---------- */
export function HouseVisual({ revealed }: VisualProps) {
  return (
    <Frame>
      <Piece on={revealed} dy={8}>
        <rect x={90} y={92} width={120} height={120} fill={PAINT.yellow} {...STROKE} />
        <Tag x={150} y={160} text="Persegi" show={revealed} size={20} />
      </Piece>
      <Piece on={revealed} dy={-14}>
        <polygon points="62,92 238,92 150,20" fill={PAINT.red} {...STROKE} />
        <Tag x={150} y={72} text="Segitiga" show={revealed} size={18} />
      </Piece>
    </Frame>
  );
}

/* ---------- 5. Segi enam: hitung sisi ---------- */
export function HexagonVisual({ revealed }: VisualProps) {
  const pts = polyPoints(150, 115, 88, 6, 0);
  return (
    <Frame>
      <polygon points={ptsToString(pts)} fill={PAINT.orange} {...STROKE} />
      <SideNumbers pts={pts} cx={150} cy={115} show={revealed} />
    </Frame>
  );
}

/* ---------- 6. Segi enam -> 6 segitiga ---------- */
export function HexagonCutVisual({ revealed }: VisualProps) {
  const cx = 150;
  const cy = 115;
  const v = polyPoints(cx, cy, 84, 6, 0);
  const colors = [
    PAINT.red,
    PAINT.yellow,
    PAINT.green,
    PAINT.blue,
    PAINT.purple,
    PAINT.pink,
  ];
  return (
    <Frame>
      {v.map((p, i) => {
        const tri: Pt[] = [[cx, cy], p, v[(i + 1) % 6]];
        const ang = ((60 * i + 30) * Math.PI) / 180;
        const [gx, gy] = centroid(tri);
        return (
          <Piece
            key={i}
            on={revealed}
            dx={Math.cos(ang) * 13}
            dy={Math.sin(ang) * 13}
            delay={i * 0.05}
          >
            <polygon points={ptsToString(tri)} fill={colors[i]} {...STROKE} />
            <NumBadge x={gx} y={gy} n={i + 1} show={revealed} delay={0.4 + i * 0.1} />
          </Piece>
        );
      })}
      <Overlay show={!revealed}>
        <polygon points={ptsToString(v)} fill={PAINT.orange} {...STROKE} />
        <CutLine a={v[0]} b={v[3]} />
        <CutLine a={v[1]} b={v[4]} />
        <CutLine a={v[2]} b={v[5]} />
      </Overlay>
    </Frame>
  );
}

/* ---------- 7. Bangun tanpa sudut ---------- */
export function CornersVisual({ revealed }: VisualProps) {
  const sq: Pt[] = [
    [22, 62],
    [92, 62],
    [92, 132],
    [22, 132],
  ];
  const tr: Pt[] = [
    [114, 132],
    [186, 132],
    [150, 62],
  ];
  const dot = (p: Pt, i: number, key: string) => (
    <circle
      key={key + i}
      cx={p[0]}
      cy={p[1]}
      r={7.5}
      fill="#e03131"
      stroke="#fff"
      strokeWidth={2.5}
      style={{
        opacity: revealed ? 1 : 0,
        transition: `opacity 0.35s ${0.15 * i + 0.1}s`,
      }}
    />
  );
  return (
    <Frame>
      <rect x={22} y={62} width={70} height={70} fill={PAINT.yellow} {...STROKE} />
      <polygon points={ptsToString(tr)} fill={PAINT.red} {...STROKE} />
      <circle cx={245} cy={97} r={36} fill={PAINT.blue} {...STROKE} />

      {sq.map((p, i) => dot(p, i, "s"))}
      {tr.map((p, i) => dot(p, i + 2, "t"))}

      <Tag x={57} y={160} text="Persegi" size={17} />
      <Tag x={150} y={160} text="Segitiga" size={17} />
      <Tag x={245} y={160} text="Lingkaran" size={17} />

      <Tag x={57} y={190} text="4 sudut" show={revealed} delay={0.2} size={16} />
      <Tag x={150} y={190} text="3 sudut" show={revealed} delay={0.5} size={16} />
      <Tag x={245} y={190} text="0 sudut" show={revealed} delay={0.8} size={16} />
    </Frame>
  );
}

/* ---------- 8. Segi lima -> 3 segitiga ---------- */
export function PentagonCutVisual({ revealed }: VisualProps) {
  const cx = 150;
  const cy = 118;
  const p = polyPoints(cx, cy, 88, 5);
  const tris: Pt[][] = [
    [p[0], p[1], p[2]],
    [p[0], p[2], p[3]],
    [p[0], p[3], p[4]],
  ];
  const colors = [PAINT.red, PAINT.yellow, PAINT.green];
  return (
    <Frame>
      {tris.map((tri, i) => {
        const [gx, gy] = centroid(tri);
        const dx = gx - cx;
        const dy = gy - cy;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <Piece
            key={i}
            on={revealed}
            dx={(dx / len) * 15}
            dy={(dy / len) * 15}
            delay={i * 0.07}
          >
            <polygon points={ptsToString(tri)} fill={colors[i]} {...STROKE} />
            <NumBadge x={gx} y={gy} n={i + 1} show={revealed} delay={0.4 + i * 0.15} />
          </Piece>
        );
      })}
      <Overlay show={!revealed}>
        <polygon points={ptsToString(p)} fill={PAINT.purple} {...STROKE} />
        <CutLine a={p[0]} b={p[2]} />
        <CutLine a={p[0]} b={p[3]} />
      </Overlay>
    </Frame>
  );
}

/* ---------- 9. Roket ---------- */
export function RocketVisual({ revealed }: VisualProps) {
  return (
    <Frame>
      {/* api */}
      <Piece on={revealed} dy={14}>
        <polygon points="136,174 164,174 150,214" fill={PAINT.orange} {...STROKE} />
      </Piece>
      {/* sirip */}
      <Piece on={revealed} dx={-22} dy={4}>
        <polygon points="120,128 120,180 86,180" fill={PAINT.green} {...STROKE} />
      </Piece>
      <Piece on={revealed} dx={22} dy={4}>
        <polygon points="180,128 180,180 214,180" fill={PAINT.green} {...STROKE} />
      </Piece>
      {/* badan: persegi panjang */}
      <rect x={120} y={75} width={60} height={105} fill={PAINT.sky} {...STROKE} />
      {/* hidung: segitiga */}
      <Piece on={revealed} dy={-16}>
        <polygon points="120,75 180,75 150,18" fill={PAINT.red} {...STROKE} />
      </Piece>
      {/* jendela: lingkaran */}
      <Piece on={revealed} dx={-80} dy={-22}>
        <circle cx={150} cy={118} r={17} fill={PAINT.yellow} {...STROKE} />
        <circle cx={144} cy={112} r={4} fill="#fff" opacity={0.85} />
      </Piece>
    </Frame>
  );
}

/* ---------- 10. Dua persegi disatukan ---------- */
export function TwoSquaresVisual({ revealed }: VisualProps) {
  return (
    <Frame>
      <Piece on={revealed} dx={15}>
        <rect x={35} y={65} width={100} height={100} fill={PAINT.yellow} {...STROKE} />
      </Piece>
      <Piece on={revealed} dx={-15}>
        <rect x={165} y={65} width={100} height={100} fill={PAINT.blue} {...STROKE} />
      </Piece>
      <Overlay show={!revealed}>
        <text
          x={150}
          y={116}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={44}
          fontWeight={700}
          fill={OUTLINE}
        >
          +
        </text>
      </Overlay>
      {/* hasil gabungan */}
      <g
        style={{
          opacity: revealed ? 1 : 0,
          transition: "opacity 0.25s 0.9s",
          pointerEvents: "none",
        }}
      >
        <rect x={50} y={65} width={200} height={100} fill={PAINT.green} {...STROKE} />
      </g>
      <Tag x={150} y={115} text="Persegi Panjang" show={revealed} delay={1.1} size={21} />
    </Frame>
  );
}
