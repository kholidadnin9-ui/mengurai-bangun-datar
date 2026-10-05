import { useEffect, useRef, useState } from "react";
import { Confetti } from "../components/Confetti";
import { Owl, type OwlMood } from "../components/Owl";
import { SoundToggle } from "../components/SoundToggle";
import { ShapeIcon, SliceIcon } from "../components/shapes";
import { QUESTIONS, type Option } from "../data/questions";
import { cn } from "../utils/cn";
import { canSpeak, sfx, speak, stopSpeaking } from "../utils/sound";

const LETTERS = ["A", "B", "C"] as const;
const LETTER_COLORS = ["#4dabf7", "#ff9f43", "#b388ff"];

type OptionState = "idle" | "correct" | "wrong" | "dim";

function OptionButton({
  letter,
  color,
  option,
  state,
  disabled,
  onClick,
}: {
  letter: string;
  color: string;
  option: Option;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "wood-plank flex w-full items-center gap-3 px-3 py-3 text-left text-lg font-semibold text-wood-800 sm:px-4 sm:text-xl",
        state === "correct" && "plank-correct animate-pop",
        state === "wrong" && "plank-wrong animate-shake",
        state === "dim" && "plank-dim",
      )}
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-4 border-wood-700 text-xl font-bold text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.45)]"
        style={{ background: color, textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}
      >
        {letter}
      </span>
      <span className="flex flex-1 flex-wrap items-center gap-x-2.5 gap-y-1">
        {option.shapes && (
          <span className="flex items-center gap-1">
            {option.shapes.map((k, i) => (
              <ShapeIcon key={k + i} kind={k} size={32} />
            ))}
          </span>
        )}
        {option.mark && (
          <span className="flex items-center gap-0.5">
            {Array.from({ length: option.markCount ?? 1 }, (_, i) => (
              <SliceIcon key={i} kind={option.mark!} size={option.markCount && option.markCount > 2 ? 26 : 32} />
            ))}
          </span>
        )}
        <span className="leading-tight">{option.text}</span>
      </span>
      {state === "correct" && (
        <span className="text-2xl" aria-label="Benar">
          ✅
        </span>
      )}
      {state === "wrong" && (
        <span className="text-2xl" aria-label="Salah">
          ❌
        </span>
      )}
    </button>
  );
}

function Progress({
  index,
  results,
}: {
  index: number;
  results: boolean[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5" aria-label="Kemajuan soal">
      {QUESTIONS.map((_, i) => {
        const done = i < results.length;
        const ok = results[i];
        const current = i === index && !done;
        return (
          <span
            key={i}
            className={cn(
              "grid h-[22px] w-[22px] place-items-center rounded-full border-[3px] text-[10px] font-bold sm:h-7 sm:w-7 sm:text-xs",
              done && ok && "border-[#1f8f46] bg-[#52c97a] text-white",
              done && !ok && "border-[#b32e2e] bg-[#ff6b6b] text-white",
              current && "animate-twinkle border-[#c25d0a] bg-[#ffd23f] text-wood-800",
              !done && !current && "border-wood-500 bg-wood-100 text-wood-500",
            )}
          >
            {done ? (ok ? "✓" : "✕") : i + 1}
          </span>
        );
      })}
    </div>
  );
}

export function QuizScreen({
  name,
  onFinish,
  onExit,
}: {
  name: string;
  onFinish: (results: boolean[]) => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const q = QUESTIONS[index];
  const answered = selected !== null;
  const correct = answered && selected === q.answer;
  const isLast = index === QUESTIONS.length - 1;
  const score = results.filter(Boolean).length * 10;
  const mood: OwlMood = !answered ? "think" : correct ? "happy" : "sad";

  useEffect(() => {
    if (answered) {
      const t = window.setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 350);
      return () => window.clearTimeout(t);
    }
  }, [answered]);

  useEffect(() => () => stopSpeaking(), []);

  function choose(i: number) {
    if (answered) return;
    stopSpeaking();
    setSelected(i);
    const ok = i === q.answer;
    setResults((r) => [...r, ok]);
    if (ok) sfx.correct();
    else sfx.wrong();
  }

  function next() {
    sfx.click();
    stopSpeaking();
    if (isLast) {
      onFinish(results);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stateOf = (i: number): OptionState => {
    if (!answered) return "idle";
    if (i === q.answer) return "correct";
    if (i === selected) return "wrong";
    return "dim";
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-16 pt-4 sm:px-6 sm:pt-6">
      {answered && correct && <Confetti key={index} count={55} />}

      {/* Papan atas: menu, nomor soal, skor, kemajuan */}
      <header className="wood-board mb-6 px-3 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onExit();
            }}
            className="btn-toy btn-orange px-3 py-1.5 text-sm font-bold sm:px-4 sm:text-base"
          >
            🏠 Menu
          </button>
          <h2 className="text-center text-xl font-bold text-wood-800 sm:text-2xl">
            Soal {index + 1}
            <span className="text-wood-600">/{QUESTIONS.length}</span>
          </h2>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="rounded-full border-4 border-wood-600 bg-wood-50 px-2.5 py-0.5 text-base font-bold text-wood-800 sm:px-3 sm:text-lg">
              ⭐ {score}
            </div>
            <SoundToggle className="h-10 w-10 sm:h-11 sm:w-11" />
          </div>
        </div>
        <div className="mt-3">
          <Progress index={index} results={results} />
        </div>
      </header>

      <main
        key={index}
        className="animate-slide-up grid items-start gap-6 lg:grid-cols-2"
      >
        {/* Kiri: pertanyaan + gambar */}
        <section className="wood-board nails p-4 sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-full border-4 border-[#c25d0a] bg-[#ff9f43] px-3 py-0.5 text-sm font-bold text-white [text-shadow:0_2px_0_rgba(0,0,0,0.25)] sm:text-base">
              {q.tag}
            </span>
            {canSpeak() && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  speak(q.prompt);
                }}
                className="btn-toy btn-blue px-3 py-1 text-sm font-bold sm:text-base"
              >
                🔊 Dengarkan
              </button>
            )}
          </div>

          <p className="paper px-4 py-3 text-xl font-semibold leading-snug text-wood-800 sm:text-2xl">
            {q.prompt}
          </p>

          <div className="paper mt-4 p-3 sm:p-4">
            <q.Visual revealed={answered} />
          </div>
        </section>

        {/* Kanan: pilihan jawaban + Pak Hoo */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            {q.options.map((opt, i) => (
              <OptionButton
                key={opt.text}
                letter={LETTERS[i]}
                color={LETTER_COLORS[i]}
                option={opt}
                state={stateOf(i)}
                disabled={answered}
                onClick={() => choose(i)}
              />
            ))}
          </div>

          <div ref={feedbackRef} className="flex flex-col gap-4">
            <div className="flex items-end gap-3">
              <Owl
                key={`${index}-${mood}`}
                mood={mood}
                size={92}
                className={cn(
                  "shrink-0",
                  mood === "happy" && "animate-hop",
                  mood === "sad" && "animate-shake",
                )}
              />
              <div className="paper relative min-h-[88px] flex-1 px-4 py-3 text-base font-medium leading-snug text-wood-800 sm:text-lg">
                <span
                  className="absolute -left-[11px] bottom-7 h-4 w-4 rotate-45 border-b-4 border-l-4 border-[#c98e4a] bg-[#fffaf0]"
                  aria-hidden="true"
                />
                {!answered ? (
                  <p className="font-semibold">
                    Ayo {name}, pilih jawaban yang benar ya! 👆
                  </p>
                ) : (
                  <div aria-live="polite">
                    <p
                      className={cn(
                        "text-xl font-bold",
                        correct ? "text-green-600" : "text-orange-600",
                      )}
                    >
                      {correct
                        ? `Hebat, ${name}! 🎉 +10 poin`
                        : `Hampir benar, ${name}! Semangat! 💪`}
                    </p>
                    {!correct && (
                      <p className="mt-1">
                        Jawaban yang benar:{" "}
                        <b>
                          {LETTERS[q.answer]}. {q.options[q.answer].text}
                        </b>
                      </p>
                    )}
                    <p className="mt-1">{q.explain}</p>
                  </div>
                )}
              </div>
            </div>

            {answered && (
              <button
                type="button"
                onClick={next}
                className="btn-toy btn-green animate-pop w-full py-3.5 text-2xl font-bold sm:text-3xl"
              >
                {isLast ? "Lihat Hasil 🏆" : "Soal Berikutnya ▶"}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
