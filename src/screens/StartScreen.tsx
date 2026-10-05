import type { CSSProperties } from "react";
import { Owl } from "../components/Owl";
import { SoundToggle } from "../components/SoundToggle";
import { SHAPE_NAME, ShapeIcon, type ShapeKind } from "../components/shapes";
import { QUESTIONS } from "../data/questions";
import { sfx } from "../utils/sound";

const SHAPES: { kind: ShapeKind; info: string }[] = [
  { kind: "square", info: "4 sisi sama panjang" },
  { kind: "rectangle", info: "4 sisi: 2 panjang, 2 pendek" },
  { kind: "triangle", info: "3 sisi, 3 sudut" },
  { kind: "pentagon", info: "5 sisi, 5 sudut" },
  { kind: "hexagon", info: "6 sisi, 6 sudut" },
  { kind: "circle", info: "bulat, tanpa sudut" },
];

const ROPE: CSSProperties = {
  background:
    "repeating-linear-gradient(135deg, #f1d9a0 0 4px, #b98a4a 4px 8px)",
  border: "2px solid #8f5120",
};

export function StartScreen({
  name,
  onNameChange,
  onStart,
  onLearn,
  onOpenShape,
}: {
  name: string;
  onNameChange: (value: string) => void;
  onStart: () => void;
  onLearn: () => void;
  onOpenShape: (kind: ShapeKind) => void;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-16 pt-4">
      <SoundToggle className="absolute right-4 top-4 z-10" />

      {/* Papan judul yang digantung */}
      <div className="animate-sway relative mt-10 w-full max-w-xl sm:mt-12">
        <span
          className="absolute -top-12 left-[16%] h-14 w-2 rounded-full"
          style={ROPE}
          aria-hidden="true"
        />
        <span
          className="absolute -top-12 right-[16%] h-14 w-2 rounded-full"
          style={ROPE}
          aria-hidden="true"
        />
        <div className="wood-board nails px-5 pb-7 pt-5 text-center sm:px-8">
          <p className="mx-auto inline-block rounded-full border-4 border-wood-600 bg-wood-50 px-4 py-1 text-sm font-bold text-wood-700 sm:text-base">
            📐 Matematika • Kelas 2 SD
          </p>
          <h1 className="title-outline mt-3 text-[2.6rem] font-bold leading-[1.05] text-wood-50 sm:text-6xl">
            Petualangan
            <br />
            <span className="text-yellow-300">Bangun</span>{" "}
            <span className="text-sky-300">Datar</span>
          </h1>
          <p className="mt-2 text-xs font-semibold tracking-wide text-wood-700 sm:text-sm">
            created by: widodo guru sd
          </p>
          <p className="mx-auto mt-4 max-w-sm text-base font-semibold text-wood-800 sm:text-lg">
            Ayo belajar <b>mengurai bangun datar</b> sambil bermain!
          </p>
        </div>
      </div>

      {/* Blok mainan melayang */}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {SHAPES.map((s, i) => (
          <div
            key={s.kind}
            className="block-toy animate-floaty grid h-14 w-14 place-items-center sm:h-[72px] sm:w-[72px]"
            style={
              {
                animationDelay: `${i * 0.35}s`,
                "--r": `${(i % 2 === 0 ? -1 : 1) * 4}deg`,
              } as CSSProperties
            }
          >
            <ShapeIcon kind={s.kind} size={44} className="sm:scale-125" />
          </div>
        ))}
      </div>

      {/* Sapaan + nama + tombol main */}
      <section className="wood-board nails mt-9 w-full p-4 sm:p-6">
        <div className="flex items-end gap-3 sm:gap-5">
          <Owl mood="happy" size={104} className="shrink-0 animate-hop" />
          <div className="paper relative flex-1 px-4 py-3 text-base font-semibold text-wood-800 sm:text-lg">
            <span
              className="absolute -left-[11px] bottom-7 h-4 w-4 rotate-45 border-b-4 border-l-4 border-[#c98e4a] bg-[#fffaf0]"
              aria-hidden="true"
            />
            Halo! Aku <b className="text-orange-600">Pak Hoo</b>. Yuk belajar{" "}
            <b>mengurai bangun datar</b>, lalu jawab <b>{QUESTIONS.length} soal</b>.
            Pilih 1 dari 3 jawaban ya!
          </div>
        </div>

        <form
          className="mt-5 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            sfx.click();
            onStart();
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-lg font-bold text-wood-800">
              ✏️ Siapa namamu?
            </span>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={14}
              placeholder="Tulis namamu di sini"
              autoComplete="off"
              className="paper w-full px-4 py-3 text-xl font-semibold text-wood-800 outline-none placeholder:text-wood-400 focus:border-orange-400"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onLearn();
            }}
            className="btn-toy btn-blue w-full py-3.5 text-2xl font-bold tracking-wide sm:text-3xl"
          >
            ✂️ BELAJAR MENGURAI
          </button>
          <button
            type="submit"
            className="btn-toy btn-green w-full py-3.5 text-2xl font-bold tracking-wide sm:text-3xl"
          >
            ▶ MAIN {QUESTIONS.length} SOAL
          </button>
        </form>
      </section>

      {/* Kenalan dulu */}
      <section className="wood-board nails mt-9 w-full p-4 sm:p-6">
        <h2 className="mb-4 text-center text-2xl font-bold text-wood-800 sm:text-3xl">
          🔍 Kenalan dulu yuk!
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {SHAPES.map((s) => (
            <button
              key={s.kind}
              type="button"
              onClick={() => {
                sfx.click();
                onOpenShape(s.kind);
              }}
              className="paper flex flex-col items-center px-2 py-3 text-center transition hover:-translate-y-1"
            >
              <ShapeIcon kind={s.kind} size={58} />
              <p className="mt-1 text-lg font-bold leading-tight text-wood-800">
                {SHAPE_NAME[s.kind]}
              </p>
              <p className="text-sm font-medium leading-tight text-wood-600">
                {s.info}
              </p>
              <p className="mt-1 text-sm font-bold text-orange-600">Potong ▶</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
