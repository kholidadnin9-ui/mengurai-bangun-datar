import { createElement, type ComponentType } from "react";
import { CutScene } from "../components/CutScene";
import { SHAPE_NAME, type ShapeKind } from "../components/shapes";
import { HouseVisual, TwoSquaresVisual, type VisualProps } from "../components/visuals";
import { cuts, type CutExample } from "./cuts";

export type OptionMark = "half" | "quarter";

export interface Option {
  text: string;
  shapes?: ShapeKind[];
  mark?: OptionMark;
  markCount?: number;
}

export interface Question {
  tag: string;
  prompt: string;
  Visual: ComponentType<VisualProps>;
  options: [Option, Option, Option];
  /** indeks jawaban benar (0 = A, 1 = B, 2 = C) */
  answer: 0 | 1 | 2;
  explain: string;
}

function view(example: CutExample): ComponentType<VisualProps> {
  function CutVisual({ revealed }: VisualProps) {
    return createElement(CutScene, { example, revealed });
  }
  CutVisual.displayName = example.id;
  return CutVisual;
}

function q(
  example: CutExample,
  prompt: string,
  options: [Option, Option, Option],
  answer: 0 | 1 | 2,
): Question {
  return {
    tag: SHAPE_NAME[example.shape],
    prompt,
    Visual: view(example),
    options,
    answer,
    explain: example.detail,
  };
}

export const QUESTIONS: Question[] = [
  q(
    cuts.squareDiag1,
    "Persegi ini dipotong 1 garis diagonal (garis miring dari pojok ke pojok). Jadi bangun apa?",
    [
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "2 lingkaran", shapes: ["circle", "circle"] },
      { text: "4 persegi", shapes: ["square", "square"] },
    ],
    0,
  ),
  q(
    cuts.squareDiag2,
    "Persegi ini dipotong 2 garis diagonal. Jadi berapa segitiga?",
    [
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "6 segitiga", shapes: ["triangle"] },
      { text: "4 segitiga", shapes: ["triangle", "triangle", "triangle", "triangle"] },
    ],
    2,
  ),
  q(
    cuts.squareVert,
    "Persegi ini dipotong 1 garis vertikal (garis tegak) di tengah. Jadi bangun apa?",
    [
      { text: "2 segi lima", shapes: ["pentagon", "pentagon"] },
      { text: "2 persegi panjang", shapes: ["rectangle", "rectangle"] },
      { text: "2 lingkaran", shapes: ["circle", "circle"] },
    ],
    1,
  ),
  q(
    cuts.squareCross,
    "Persegi ini dipotong 1 garis tegak dan 1 garis mendatar tepat di tengah. Jadi bangun apa?",
    [
      { text: "4 persegi panjang", shapes: ["rectangle", "rectangle"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "4 persegi", shapes: ["square", "square", "square", "square"] },
    ],
    2,
  ),
  q(
    cuts.squareCrossOff,
    "Persegi ini dipotong 1 garis tegak dan 1 garis mendatar, tapi tidak di tengah. Jadi bangun apa?",
    [
      { text: "4 persegi panjang", shapes: ["rectangle", "rectangle", "rectangle", "rectangle"] },
      { text: "4 persegi", shapes: ["square", "square", "square", "square"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
    ],
    0,
  ),
  q(
    cuts.rectDiag1,
    "Persegi panjang ini dipotong 1 garis diagonal. Jadi bangun apa?",
    [
      { text: "2 segi enam", shapes: ["hexagon", "hexagon"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "4 persegi", shapes: ["square", "square"] },
    ],
    1,
  ),
  q(
    cuts.rectVert,
    "Persegi panjang ini dipotong 1 garis tegak di tengah. Jadi bangun apa?",
    [
      { text: "2 lingkaran", shapes: ["circle", "circle"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "2 persegi", shapes: ["square", "square"] },
    ],
    2,
  ),
  q(
    cuts.rectCross,
    "Persegi panjang ini dipotong 1 garis tegak dan 1 garis mendatar. Jadi bangun apa?",
    [
      { text: "4 persegi", shapes: ["square", "square", "square", "square"] },
      { text: "4 persegi panjang", shapes: ["rectangle", "rectangle", "rectangle", "rectangle"] },
      { text: "4 segitiga", shapes: ["triangle", "triangle"] },
    ],
    1,
  ),
  q(
    cuts.triHeight,
    "Segitiga ini dipotong 1 garis dari puncak ke tengah alas. Jadi berapa segitiga?",
    [
      { text: "4 segitiga", shapes: ["triangle"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "6 segitiga", shapes: ["triangle"] },
    ],
    1,
  ),
  q(
    cuts.triMid,
    "Titik tengah setiap sisi segitiga ini dihubungkan. Jadi berapa segitiga?",
    [
      { text: "4 segitiga", shapes: ["triangle", "triangle", "triangle", "triangle"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "3 lingkaran", shapes: ["circle"] },
    ],
    0,
  ),
  q(
    cuts.pentVertex,
    "Segi lima ini dipotong 2 garis dari satu pojok. Jadi berapa segitiga?",
    [
      { text: "5 segitiga", shapes: ["triangle"] },
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "3 segitiga", shapes: ["triangle", "triangle", "triangle"] },
    ],
    2,
  ),
  q(
    cuts.pentCenter,
    "Segi lima ini dipotong dari titik tengah ke setiap pojok. Jadi berapa segitiga?",
    [
      { text: "3 segitiga", shapes: ["triangle", "triangle", "triangle"] },
      { text: "5 segitiga", shapes: ["triangle"] },
      { text: "6 segitiga", shapes: ["triangle"] },
    ],
    1,
  ),
  q(
    cuts.hexCenter,
    "Segi enam ini dipotong dari titik tengah ke setiap pojok. Jadi berapa segitiga?",
    [
      { text: "6 segitiga", shapes: ["triangle"] },
      { text: "4 segitiga", shapes: ["triangle"] },
      { text: "5 segitiga", shapes: ["triangle"] },
    ],
    0,
  ),
  q(
    cuts.hexVert,
    "Segi enam ini dipotong 1 garis tegak di tengah. Setiap bagian punya 5 sisi. Jadi bangun apa?",
    [
      { text: "2 lingkaran", shapes: ["circle", "circle"] },
      { text: "2 persegi", shapes: ["square", "square"] },
      { text: "2 segi lima", shapes: ["pentagon", "pentagon"] },
    ],
    2,
  ),
  q(
    cuts.circleHalf,
    "Lingkaran ini dipotong 1 garis lewat titik tengah. Jadi apa?",
    [
      { text: "2 segitiga", shapes: ["triangle", "triangle"] },
      { text: "2 setengah lingkaran", mark: "half", markCount: 2 },
      { text: "4 persegi", shapes: ["square", "square"] },
    ],
    1,
  ),
  q(
    cuts.circleQuarter,
    "Lingkaran ini dipotong 2 garis lewat titik tengah. Jadi apa?",
    [
      { text: "4 seperempat lingkaran", mark: "quarter", markCount: 4 },
      { text: "2 setengah lingkaran", mark: "half", markCount: 2 },
      { text: "6 segitiga", shapes: ["triangle"] },
    ],
    0,
  ),
  {
    tag: "Bangun Gabungan",
    prompt: "Rumah mainan ini tersusun dari bangun apa saja?",
    Visual: HouseVisual,
    options: [
      { text: "Lingkaran dan persegi panjang", shapes: ["circle", "rectangle"] },
      { text: "Segitiga dan persegi", shapes: ["triangle", "square"] },
      { text: "Segi lima dan segi enam", shapes: ["pentagon", "hexagon"] },
    ],
    answer: 1,
    explain: "Atap rumah berbentuk segitiga, dan badan rumah berbentuk persegi.",
  },
  {
    tag: "Menyusun",
    prompt: "Dua persegi yang sama besar disatukan. Bangun apa yang terbentuk?",
    Visual: TwoSquaresVisual,
    options: [
      { text: "Segitiga", shapes: ["triangle"] },
      { text: "Persegi panjang", shapes: ["rectangle"] },
      { text: "Lingkaran", shapes: ["circle"] },
    ],
    answer: 1,
    explain:
      "Dua persegi yang disatukan membentuk sebuah persegi panjang. Kebalikan dari mengurai adalah menyusun!",
  },
];
