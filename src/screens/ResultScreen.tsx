import { useEffect, type CSSProperties } from "react";
import { Confetti } from "../components/Confetti";
import { Owl } from "../components/Owl";
import { QUESTIONS } from "../data/questions";
import { cn } from "../utils/cn";
import { sfx } from "../utils/sound";

function starPoints(size: number): string {
  const c = size / 2;
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? c * 0.92 : c * 0.4;
    const a = ((-90 + 36 * i) * Math.PI) / 180;
    return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a) + 1).toFixed(2)}`;
  }).join(" ");
}

function Star({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="animate-pop h-16 w-16 sm:h-24 sm:w-24"
      style={{ animationDelay: `${delay}s` } as CSSProperties}
      aria-label={filled ? "Bintang terisi" : "Bintang kosong"}
    >
      <polygon
        points={starPoints(48)}
        fill={filled ? "#ffd23f" : "#e9d3a5"}
        stroke="#6b3b17"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {filled && (
        <polygon
          points="24,9 27,18 24,20 21,18"
          fill="#fff"
          opacity="0.8"
        />
      )}
    </svg>
  );
}

export function ResultScreen({
  name,
  results,
  onRestart,
  onLearn,
  onHome,
}: {
  name: string;
  results: boolean[];
  onRestart: () => void;
  onLearn: () => void;
  onHome: () => void;
}) {
  const total = QUESTIONS.length;
  const correct = results.filter(Boolean).length;
  const score = correct * 10;
  const ratio = total === 0 ? 0 : correct / total;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
  const great = ratio >= 0.6;

  const message =
    correct === total
      ? "Luar biasa! Kamu Juara Bangun Datar! 🏆"
      : ratio >= 0.8
        ? "Hebat sekali! Kamu pintar mengurai bangun datar! 🌟"
        : ratio >= 0.6
          ? "Bagus! Sedikit lagi kamu jadi juara! 👍"
          : "Tidak apa-apa. Belajar di Meja Potong dulu, lalu coba lagi! 💪";

  useEffect(() => {
    if (great) sfx.win();
    window.scrollTo({ top: 0 });
  }, [great]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:pt-12">
      {great && <Confetti count={100} />}

      <div className="wood-board nails animate-pop px-4 pb-8 pt-6 text-center sm:px-8">
        <h1 className="title-outline text-5xl font-bold text-wood-50 sm:text-6xl">
          Selesai!
        </h1>
        <p className="mt-3 text-xl font-bold text-wood-800 sm:text-2xl">
          Kerja bagus, {name}!
        </p>

        <div className="mt-4 flex items-end justify-center gap-1 sm:gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn(i === 1 && "-translate-y-3")}>
              <Star filled={i < stars} delay={0.2 + i * 0.25} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-center gap-3">
          <Owl
            mood={great ? "happy" : "think"}
            size={110}
            className={cn("shrink-0", great && "animate-hop")}
          />
          <div className="paper relative flex-1 px-4 py-3 text-left text-lg font-semibold leading-snug text-wood-800 sm:text-xl">
            <span
              className="absolute -left-[11px] bottom-8 h-4 w-4 rotate-45 border-b-4 border-l-4 border-[#c98e4a] bg-[#fffaf0]"
              aria-hidden="true"
            />
            {message}
          </div>
        </div>

        <div className="paper mt-6 px-4 py-4">
          <p className="text-base font-bold text-wood-600 sm:text-lg">Skor kamu</p>
          <p className="text-7xl font-bold leading-none text-orange-500 [text-shadow:0_4px_0_#6b3b17] sm:text-8xl">
            {score}
          </p>
          <p className="mt-2 text-lg font-bold text-wood-800">
            Benar {correct} dari {total} soal
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {results.map((ok, i) => (
              <span
                key={i}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full border-[3px] text-sm font-bold text-white sm:h-10 sm:w-10",
                  ok
                    ? "border-[#1f8f46] bg-[#52c97a]"
                    : "border-[#b32e2e] bg-[#ff6b6b]",
                )}
                title={`Soal ${i + 1}: ${ok ? "benar" : "salah"}`}
              >
                {ok ? "✓" : "✕"}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onRestart();
            }}
            className="btn-toy btn-green w-full py-3.5 text-2xl font-bold"
          >
            🔄 Main Lagi
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onLearn();
            }}
            className="btn-toy btn-blue w-full py-3.5 text-2xl font-bold"
          >
            ✂️ Belajar Mengurai
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onHome();
            }}
            className="btn-toy btn-orange w-full py-3.5 text-2xl font-bold"
          >
            🏠 Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
}
