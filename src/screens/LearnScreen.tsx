import { useState, type ComponentType } from "react";
import { CutScene } from "../components/CutScene";
import { Owl } from "../components/Owl";
import { SoundToggle } from "../components/SoundToggle";
import {
  SHAPE_NAME,
  SliceIcon,
  ShapeIcon,
  type ShapeKind,
} from "../components/shapes";
import {
  CornersVisual,
  HouseVisual,
  RocketVisual,
  TwoSquaresVisual,
  type VisualProps,
} from "../components/visuals";
import { LESSONS, type CutExample } from "../data/cuts";
import { cn } from "../utils/cn";
import { canSpeak, sfx, speak } from "../utils/sound";

type Tab = ShapeKind | "combo";

const TABS: { id: Tab; label: string }[] = [
  { id: "square", label: "Persegi" },
  { id: "rectangle", label: "Persegi Panjang" },
  { id: "triangle", label: "Segitiga" },
  { id: "pentagon", label: "Segi Lima" },
  { id: "hexagon", label: "Segi Enam" },
  { id: "circle", label: "Lingkaran" },
  { id: "combo", label: "Gabungan" },
];

function ResultBits({ example }: { example: CutExample }) {
  if (example.slice && example.sliceCount) {
    return (
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: Math.min(example.sliceCount, 4) }, (_, i) => (
          <SliceIcon key={i} kind={example.slice!} size={30} />
        ))}
      </span>
    );
  }
  if (!example.icons?.length) return null;
  const icons =
    example.icons.length > 4 ? example.icons.slice(0, 1) : example.icons;
  return (
    <span className="inline-flex items-center gap-0.5">
      {icons.map((k, i) => (
        <ShapeIcon key={k + i} kind={k} size={30} />
      ))}
      {example.icons.length > 4 && (
        <span className="text-lg font-bold">× {example.icons.length}</span>
      )}
    </span>
  );
}

function CutCard({
  example,
  index,
  revealed,
  onToggle,
}: {
  example: CutExample;
  index: number;
  revealed: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="paper flex flex-col p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full border-[3px] border-wood-600 bg-[#ffd23f] px-2.5 py-0.5 text-sm font-bold text-wood-800">
          Contoh {index + 1}
        </span>
        <ShapeIcon kind={example.shape} size={32} />
      </div>
      <h3 className="text-lg font-bold leading-tight text-wood-800 sm:text-xl">
        {example.title}
      </h3>
      <p className="mt-1 text-sm font-medium leading-snug text-wood-600 sm:text-base">
        {example.how}
      </p>
      <div className="mt-3 rounded-2xl border-4 border-dashed border-[#e7c48a] bg-white/70 py-1">
        <CutScene example={example} revealed={revealed} compact />
      </div>
      <p
        className="mt-3 flex flex-wrap items-center gap-2 text-lg font-bold leading-tight text-wood-800"
        aria-live="polite"
      >
        {revealed ? (
          <>
            <span>
              Jadi <span className="text-orange-600">{example.result}</span>
            </span>
            <ResultBits example={example} />
          </>
        ) : (
          <span className="text-wood-600">Bangunnya masih utuh. Ayo potong!</span>
        )}
      </p>
      {revealed && (
        <p className="animate-pop mt-1 text-base font-medium leading-snug text-wood-700">
          {example.detail}
        </p>
      )}
      <button
        type="button"
        aria-pressed={revealed}
        onClick={onToggle}
        className={cn(
          "btn-toy mt-3 w-full py-3 text-xl font-bold",
          revealed ? "btn-blue" : "btn-orange",
        )}
      >
        {revealed ? "↺ Lihat utuh" : "✂️ Potong!"}
      </button>
    </article>
  );
}

const COMBO: {
  title: string;
  how: string;
  result: string;
  button: [string, string];
  Visual: ComponentType<VisualProps>;
}[] = [
  {
    title: "Rumah mainan",
    how: "Bangun gabungan bisa diurai menjadi bangun-bangun yang kita kenal.",
    result: "Atapnya segitiga, badannya persegi.",
    button: ["🔍 Urai!", "↺ Lihat utuh"],
    Visual: HouseVisual,
  },
  {
    title: "Roket mainan",
    how: "Cari persegi panjang, segitiga, dan lingkaran di roket ini.",
    result:
      "Badan = persegi panjang. Hidung, sirip, dan api = segitiga. Jendela = lingkaran.",
    button: ["🔍 Urai!", "↺ Lihat utuh"],
    Visual: RocketVisual,
  },
  {
    title: "Menyusun 2 persegi",
    how: "Kebalikan mengurai adalah menyusun. Dua persegi yang sama besar disatukan.",
    result: "Jadinya 1 persegi panjang!",
    button: ["🧩 Satukan!", "↺ Pisahkan"],
    Visual: TwoSquaresVisual,
  },
  {
    title: "Siapa yang punya sudut?",
    how: "Sudut ada di pojok yang runcing. Lingkaran tidak punya pojok.",
    result: "Persegi 4 sudut, segitiga 3 sudut, lingkaran 0 sudut.",
    button: ["🔍 Hitung sudut!", "↺ Tutup"],
    Visual: CornersVisual,
  },
];

function ComboCard({
  item,
  revealed,
  onToggle,
}: {
  item: (typeof COMBO)[number];
  revealed: boolean;
  onToggle: () => void;
}) {
  const Visual = item.Visual;
  return (
    <article className="paper flex flex-col p-3 sm:p-4">
      <h3 className="text-lg font-bold leading-tight text-wood-800 sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-1 text-sm font-medium leading-snug text-wood-600 sm:text-base">
        {item.how}
      </p>
      <div className="mt-3 rounded-2xl border-4 border-dashed border-[#e7c48a] bg-white/70 py-1">
        <Visual revealed={revealed} />
      </div>
      <p className="mt-3 text-lg font-bold leading-tight text-wood-800" aria-live="polite">
        {revealed ? (
          <span className="text-orange-600">{item.result}</span>
        ) : (
          <span className="text-wood-600">Tekan tombol untuk melihat.</span>
        )}
      </p>
      <button
        type="button"
        aria-pressed={revealed}
        onClick={onToggle}
        className={cn(
          "btn-toy mt-3 w-full py-3 text-xl font-bold",
          revealed ? "btn-blue" : "btn-orange",
        )}
      >
        {revealed ? item.button[1] : item.button[0]}
      </button>
    </article>
  );
}

export function LearnScreen({
  initialTab = "square",
  onBack,
  onPlay,
}: {
  initialTab?: Tab;
  onBack: () => void;
  onPlay: () => void;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const lesson = LESSONS.find((l) => l.kind === tab);
  const cutCount = lesson?.examples.length ?? COMBO.length;
  const cutDone = lesson
    ? lesson.examples.filter((e) => revealed[e.id]).length
    : COMBO.filter((_, i) => revealed["combo-" + i]).length;
  const allCut = cutDone === cutCount && cutCount > 0;

  function select(next: Tab) {
    if (next === tab) return;
    sfx.click();
    setTab(next);
    setRevealed({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggle(id: string) {
    setRevealed((prev) => {
      const on = !prev[id];
      if (on) sfx.snip();
      else sfx.click();
      return { ...prev, [id]: on };
    });
  }

  function toggleAll() {
    if (!lesson) return;
    const on = !allCut;
    if (on) sfx.snip();
    else sfx.click();
    setRevealed(
      Object.fromEntries(lesson.examples.map((e) => [e.id, on])),
    );
  }

  const intro = lesson
    ? lesson.intro
    : "Bangun bisa disusun jadi gambar, lalu diurai lagi. Ayo amati!";

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-16 pt-3 sm:px-6 sm:pt-5">
      <header className="wood-board mb-4 px-3 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onBack();
            }}
            className="btn-toy btn-orange px-3 py-1.5 text-sm font-bold sm:px-4 sm:text-base"
          >
            🏠 Menu
          </button>
          <h1 className="min-w-0 flex-1 text-center text-lg font-bold leading-tight text-wood-800 sm:text-2xl">
            Meja Potong Pak Hoo
          </h1>
          <SoundToggle className="h-10 w-10 sm:h-11 sm:w-11" />
        </div>
        <p className="mt-1 text-center text-sm font-semibold text-wood-700 sm:text-base">
          Belajar mengurai bangun datar
        </p>
      </header>

      <div className="sticky top-0 z-20 -mx-3 bg-gradient-to-b from-[#f3c27b] from-70% to-transparent px-3 pb-3 pt-1 sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto px-1 pb-4 pt-1">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                aria-pressed={on}
                className={cn(
                  "wood-plank flex min-w-[76px] shrink-0 flex-col items-center gap-0.5 px-2 py-2 sm:min-w-[96px]",
                  on && "chip-on",
                )}
              >
                {t.id === "combo" ? (
                  <span className="text-3xl leading-none" aria-hidden>
                    🏠
                  </span>
                ) : (
                  <ShapeIcon kind={t.id} size={32} />
                )}
                <span className="max-w-[88px] text-center text-xs font-bold leading-tight text-wood-800 sm:text-sm">
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section key={tab} className="animate-slide-up">
        <div className="flex items-end gap-3">
          <Owl
            mood={allCut ? "happy" : "think"}
            size={96}
            className={cn("shrink-0", allCut && "animate-hop")}
          />
          <div className="paper relative flex-1 px-4 py-3 text-base font-semibold leading-snug text-wood-800 sm:text-lg">
            <span
              className="absolute -left-[11px] bottom-7 h-4 w-4 rotate-45 border-b-4 border-l-4 border-[#c98e4a] bg-[#fffaf0]"
              aria-hidden="true"
            />
            {tab !== "combo" && (
              <p className="text-sm font-bold text-orange-600">
                {SHAPE_NAME[tab as ShapeKind]}
              </p>
            )}
            <p>{intro}</p>
            {canSpeak() && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  speak(intro);
                }}
                className="btn-toy btn-blue mt-2 px-3 py-1 text-sm font-bold"
              >
                🔊 Dengarkan
              </button>
            )}
          </div>
        </div>

        {lesson && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="rounded-full border-4 border-wood-600 bg-wood-50 px-3 py-1 text-sm font-bold text-wood-800 sm:text-base">
              Sudah dipotong {cutDone} dari {cutCount}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="btn-toy btn-orange px-4 py-1.5 text-sm font-bold sm:text-base"
            >
              {allCut ? "↺ Utuh semua" : "✂️ Potong semua"}
            </button>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {lesson
            ? lesson.examples.map((example, i) => (
                <CutCard
                  key={example.id}
                  example={example}
                  index={i}
                  revealed={!!revealed[example.id]}
                  onToggle={() => toggle(example.id)}
                />
              ))
            : COMBO.map((item, i) => (
                <ComboCard
                  key={item.title}
                  item={item}
                  revealed={!!revealed["combo-" + i]}
                  onToggle={() => toggle("combo-" + i)}
                />
              ))}
        </div>

        {lesson && (
          <div className="wood-board nails mt-5 px-4 py-4 sm:px-5">
            <h2 className="text-lg font-bold text-wood-800 sm:text-xl">
              ⭐ Ingat ya!
            </h2>
            <p className="mt-1 text-base font-semibold leading-snug text-wood-800 sm:text-lg">
              {lesson.remember}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onPlay();
          }}
          className="btn-toy btn-green mt-5 w-full py-4 text-2xl font-bold sm:text-3xl"
        >
          Sudah paham? Ayo main soal ▶
        </button>
      </section>
    </div>
  );
}
