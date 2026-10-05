import { OUTLINE } from "./shapes";

export type OwlMood = "think" | "happy" | "sad";

export function Owl({
  mood = "think",
  size = 110,
  className,
}: {
  mood?: OwlMood;
  size?: number;
  className?: string;
}) {
  const happy = mood === "happy";
  const sad = mood === "sad";
  const stroke = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: "round" as const };

  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={(size * 140) / 120}
      className={className}
      role="img"
      aria-label="Pak Hoo si burung hantu"
    >
      {/* kaki */}
      <ellipse cx="44" cy="131" rx="12" ry="6" fill="#ffb02e" {...stroke} strokeWidth={3.5} />
      <ellipse cx="76" cy="131" rx="12" ry="6" fill="#ffb02e" {...stroke} strokeWidth={3.5} />

      {/* sayap */}
      <g
        style={{
          transformOrigin: "22px 74px",
          transform: happy ? "rotate(-42deg)" : "rotate(8deg)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <ellipse cx="14" cy="90" rx="10" ry="24" fill="#8f5120" {...stroke} strokeWidth={3.5} />
      </g>
      <g
        style={{
          transformOrigin: "98px 74px",
          transform: happy ? "rotate(42deg)" : "rotate(-8deg)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <ellipse cx="106" cy="90" rx="10" ry="24" fill="#8f5120" {...stroke} strokeWidth={3.5} />
      </g>

      {/* badan & perut */}
      <ellipse cx="60" cy="84" rx="44" ry="46" fill="#c07a3e" {...stroke} />
      <ellipse cx="60" cy="102" rx="28" ry="26" fill="#ffe7b3" />
      <g fill="none" stroke="#e2b46b" strokeWidth="3" strokeLinecap="round">
        <path d="M46 98 q4 5 8 0" />
        <path d="M66 98 q4 5 8 0" />
        <path d="M56 112 q4 5 8 0" />
      </g>

      {/* mata */}
      {happy ? (
        <g fill="none" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round">
          <path d="M27 70 Q42 50 57 70" />
          <path d="M63 70 Q78 50 93 70" />
        </g>
      ) : (
        <>
          <g className="owl-eye">
            <circle cx="42" cy="64" r="16" fill="#fff" {...stroke} strokeWidth={3.5} />
            <circle cx={sad ? 42 : 44} cy={sad ? 69 : 66} r="7" fill="#3b2412" />
            <circle cx={sad ? 40 : 42} cy={sad ? 66 : 63.5} r="2.4" fill="#fff" />
          </g>
          <g className="owl-eye">
            <circle cx="78" cy="64" r="16" fill="#fff" {...stroke} strokeWidth={3.5} />
            <circle cx={sad ? 78 : 76} cy={sad ? 69 : 66} r="7" fill="#3b2412" />
            <circle cx={sad ? 76 : 74} cy={sad ? 66 : 63.5} r="2.4" fill="#fff" />
          </g>
        </>
      )}

      {/* alis sedih & air mata */}
      {sad && (
        <>
          <path d="M26 54 L52 46" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
          <path d="M94 54 L68 46" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
          <path d="M32 80 q-6 9 0 14 q6 -5 0 -14z" fill="#7cc4ff" stroke={OUTLINE} strokeWidth="2" />
        </>
      )}

      {/* pipi */}
      {happy && (
        <>
          <circle cx="25" cy="82" r="6.5" fill="#ff8fb1" opacity="0.75" />
          <circle cx="95" cy="82" r="6.5" fill="#ff8fb1" opacity="0.75" />
        </>
      )}

      {/* paruh */}
      <path d="M53 76 L67 76 L60 91 Z" fill="#ffb02e" {...stroke} strokeWidth={3.2} />

      {/* topi wisuda (persegi belah ketupat!) */}
      <path d="M42 36 v10 q18 9 36 0 v-10" fill="#2563eb" {...stroke} strokeWidth={3.2} />
      <polygon points="24,30 60,14 96,30 60,44" fill="#3b82f6" {...stroke} strokeWidth={3.5} />
      <path d="M60 30 L92 34 L92 48" fill="none" stroke="#ffd23f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="92" cy="51" r="4.2" fill="#ffd23f" stroke={OUTLINE} strokeWidth="2" />
    </svg>
  );
}
