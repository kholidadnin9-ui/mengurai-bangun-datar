import { OUTLINE, centroid, ptsToString, type Pt } from "./shapes";
import type { CutExample, CutPiece } from "../data/cuts";
import { cn } from "../utils/cn";

const STROKE = {
  stroke: OUTLINE,
  strokeWidth: 4,
  strokeLinejoin: "round" as const,
};

function Badge({
  x,
  y,
  n,
  show,
  delay = 0.35,
  r = 12,
  fill = "#fff",
}: {
  x: number;
  y: number;
  n: number;
  show: boolean;
  delay?: number;
  r?: number;
  fill?: string;
}) {
  return (
    <g style={{ opacity: show ? 1 : 0, transition: `opacity 0.35s ${delay}s` }}>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={OUTLINE} strokeWidth={r > 10 ? 3 : 2.2} />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={r > 10 ? 15 : 11}
        fontWeight={700}
        fill={OUTLINE}
      >
        {n}
      </text>
    </g>
  );
}

function labelPoint(piece: CutPiece): Pt {
  if (piece.kind === "path") return piece.labelAt;
  return centroid(piece.points);
}

function SideNumbers({ points, show }: { points: Pt[]; show: boolean }) {
  const [cx, cy] = centroid(points);
  return (
    <>
      {points.map((p, i) => {
        const q = points[(i + 1) % points.length];
        const mx = (p[0] + q[0]) / 2;
        const my = (p[1] + q[1]) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <Badge
            key={i}
            x={mx + (dx / len) * 15}
            y={my + (dy / len) * 15}
            n={i + 1}
            show={show}
            delay={0.15 * i + 0.25}
            r={8.5}
            fill="#ffe08a"
          />
        );
      })}
    </>
  );
}

export function CutScene({
  example,
  revealed,
  compact = false,
}: {
  example: CutExample;
  revealed: boolean;
  compact?: boolean;
}) {
  const many = example.pieces.length > 4;

  return (
    <svg
      viewBox="0 0 300 230"
      className={cn(
        "mx-auto block h-auto w-full",
        compact ? "max-w-[340px]" : "max-w-[280px] sm:max-w-[380px]",
      )}
      role="img"
      aria-label={
        revealed
          ? `${example.title}. Hasilnya ${example.result}.`
          : `${example.title}. Belum dipotong.`
      }
    >
      {example.pieces.map((piece, i) => {
        const [lx, ly] = labelPoint(piece);
        return (
          <g
            key={i}
            style={{
              transform: `translate(${revealed ? piece.dx : 0}px, ${revealed ? piece.dy : 0}px)`,
              transition: `transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${piece.delay}s`,
            }}
          >
            {piece.kind === "poly" ? (
              <polygon points={ptsToString(piece.points)} fill={piece.fill} {...STROKE} />
            ) : (
              <path d={piece.d} fill={piece.fill} {...STROKE} />
            )}
            {!example.showSideNumbers && (
              <Badge
                x={lx}
                y={ly}
                n={i + 1}
                show={revealed}
                delay={0.35 + i * 0.08}
                r={many ? 10 : 12}
              />
            )}
            {example.showSideNumbers && piece.kind === "poly" && (
              <SideNumbers points={piece.points} show={revealed} />
            )}
          </g>
        );
      })}

      <g
        style={{
          opacity: revealed ? 0 : 1,
          transition: "opacity 0.15s",
          pointerEvents: "none",
        }}
      >
        {example.whole.kind === "circle" ? (
          <circle
            cx={example.whole.cx}
            cy={example.whole.cy}
            r={example.whole.r}
            fill={example.whole.fill}
            {...STROKE}
          />
        ) : (
          <polygon
            points={ptsToString(example.whole.points)}
            fill={example.whole.fill}
            {...STROKE}
          />
        )}
        {example.cuts.map(([a, b], i) => (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke="#e03131"
            strokeWidth={4}
            strokeDasharray="10 9"
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}
