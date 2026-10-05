import { useMemo, type CSSProperties } from "react";

const COLORS = ["#ff6b6b", "#ffd23f", "#52c97a", "#4dabf7", "#b388ff", "#ff9f43", "#ff8fb1"];

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const round = Math.random() > 0.6;
        const size = 8 + Math.random() * 9;
        return {
          left: Math.random() * 100,
          delay: Math.random() * 0.7,
          duration: 2.2 + Math.random() * 1.8,
          width: size,
          height: round ? size : size * 0.6,
          color: COLORS[i % COLORS.length],
          dx: (Math.random() - 0.5) * 180,
          round,
        };
      }),
    [count],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              width: p.width,
              height: p.height,
              background: p.color,
              borderRadius: p.round ? "50%" : "2px",
              opacity: 0,
              animation: `confetti ${p.duration}s ${p.delay}s ease-in forwards`,
              "--dx": `${p.dx}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
