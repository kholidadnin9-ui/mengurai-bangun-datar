import {
  PAINT,
  SHAPE_COLOR,
  centroid,
  polyPoints,
  type Pt,
  type ShapeKind,
} from "../components/shapes";

export interface PolyPiece {
  kind: "poly";
  points: Pt[];
  fill: string;
  dx: number;
  dy: number;
  delay: number;
}

export interface PathPiece {
  kind: "path";
  d: string;
  fill: string;
  dx: number;
  dy: number;
  delay: number;
  labelAt: Pt;
}

export type CutPiece = PolyPiece | PathPiece;

export type WholeShape =
  | { kind: "poly"; points: Pt[]; fill: string }
  | { kind: "circle"; cx: number; cy: number; r: number; fill: string };

export interface CutExample {
  id: string;
  shape: ShapeKind;
  /** Judul kartu, mis. "1 garis diagonal" */
  title: string;
  /** Penjelasan cara memotong, bahasa anak */
  how: string;
  /** Hasil singkat, mis. "2 segitiga" */
  result: string;
  /** Penjelasan setelah dipotong — dipakai juga di soal */
  detail: string;
  icons?: ShapeKind[];
  slice?: "half" | "quarter";
  sliceCount?: number;
  /** Nomor di setiap sisi saat sudah terurai (untuk menghitung sisi) */
  showSideNumbers?: boolean;
  whole: WholeShape;
  cuts: [Pt, Pt][];
  pieces: CutPiece[];
}

export interface LessonGroup {
  kind: ShapeKind;
  intro: string;
  remember: string;
  examples: CutExample[];
}

const FILLS = [
  PAINT.red,
  PAINT.yellow,
  PAINT.green,
  PAINT.blue,
  PAINT.purple,
  PAINT.pink,
  PAINT.orange,
  PAINT.sky,
];

function shift(points: Pt[], origin: Pt, dist: number): [number, number] {
  const [gx, gy] = centroid(points);
  const dx = gx - origin[0];
  const dy = gy - origin[1];
  const len = Math.hypot(dx, dy) || 1;
  return [(dx / len) * dist, (dy / len) * dist];
}

function polys(
  groups: Pt[][],
  origin: Pt,
  dist: number,
): PolyPiece[] {
  return groups.map((points, i) => {
    const [dx, dy] = shift(points, origin, dist);
    return {
      kind: "poly",
      points,
      fill: FILLS[i % FILLS.length],
      dx,
      dy,
      delay: i * 0.06,
    };
  });
}

function fan(vertices: Pt[], center: Pt, dist: number): PolyPiece[] {
  const groups = vertices.map(
    (p, i) => [center, p, vertices[(i + 1) % vertices.length]] as Pt[],
  );
  return polys(groups, center, dist);
}

function radii(vertices: Pt[], center: Pt): [Pt, Pt][] {
  return vertices.map((p) => [center, p]);
}

const n = (v: number) => Number(v.toFixed(2));

/* ===================== PERSEGI ===================== */

const SX = 72;
const SY = 38;
const SS = 156;
const TL: Pt = [SX, SY];
const TR: Pt = [SX + SS, SY];
const BR: Pt = [SX + SS, SY + SS];
const BL: Pt = [SX, SY + SS];
const SC: Pt = [SX + SS / 2, SY + SS / 2];
const squareWhole: WholeShape = {
  kind: "poly",
  points: [TL, TR, BR, BL],
  fill: SHAPE_COLOR.square,
};

const squareDiag1: CutExample = {
  id: "square-diag1",
  shape: "square",
  title: "1 garis diagonal",
  how: "Garis diagonal = garis miring dari pojok ke pojok.",
  result: "2 segitiga",
  detail:
    "Satu garis diagonal mengurai persegi menjadi 2 segitiga yang sama besar.",
  icons: ["triangle", "triangle"],
  whole: squareWhole,
  cuts: [[TL, BR]],
  pieces: polys(
    [
      [TL, TR, BR],
      [TL, BR, BL],
    ],
    SC,
    16,
  ),
};

const squareDiag2: CutExample = {
  id: "square-diag2",
  shape: "square",
  title: "2 garis diagonal",
  how: "Dua garis miring, dari pojok ke pojok. Keduanya bertemu di tengah.",
  result: "4 segitiga",
  detail:
    "Dua garis diagonal bertemu di tengah. Persegi terurai menjadi 4 segitiga.",
  icons: ["triangle", "triangle", "triangle", "triangle"],
  whole: squareWhole,
  cuts: [
    [TL, BR],
    [TR, BL],
  ],
  pieces: polys(
    [
      [TL, TR, SC],
      [TR, BR, SC],
      [BR, BL, SC],
      [BL, TL, SC],
    ],
    SC,
    15,
  ),
};

const squareVert: CutExample = {
  id: "square-vert",
  shape: "square",
  title: "1 garis vertikal",
  how: "Garis vertikal = garis tegak, dari atas ke bawah, tepat di tengah.",
  result: "2 persegi panjang",
  detail:
    "Satu garis tegak di tengah mengurai persegi menjadi 2 persegi panjang yang sama besar.",
  icons: ["rectangle", "rectangle"],
  whole: squareWhole,
  cuts: [
    [
      [SC[0], SY],
      [SC[0], SY + SS],
    ],
  ],
  pieces: polys(
    [
      [TL, [SC[0], SY], [SC[0], SY + SS], BL],
      [[SC[0], SY], TR, BR, [SC[0], SY + SS]],
    ],
    SC,
    16,
  ),
};

const squareCross: CutExample = {
  id: "square-cross",
  shape: "square",
  title: "Garis tegak + mendatar, tepat di tengah",
  how: "Garis vertikal dan garis horizontal bertemu tepat di titik tengah.",
  result: "4 persegi",
  detail:
    "Karena kedua garis tepat di tengah, keempat bagiannya sama dan semua sisinya sama panjang. Namanya persegi, bukan persegi panjang!",
  icons: ["square", "square", "square", "square"],
  whole: squareWhole,
  cuts: [
    [
      [SC[0], SY],
      [SC[0], SY + SS],
    ],
    [
      [SX, SC[1]],
      [SX + SS, SC[1]],
    ],
  ],
  pieces: polys(
    [
      [TL, [SC[0], SY], SC, [SX, SC[1]]],
      [[SC[0], SY], TR, [SX + SS, SC[1]], SC],
      [SC, [SX + SS, SC[1]], BR, [SC[0], SY + SS]],
      [[SX, SC[1]], SC, [SC[0], SY + SS], BL],
    ],
    SC,
    14,
  ),
};

// Tidak di tengah, dan tidak ada bagian yang kebetulan persegi.
// Kiri 46, kanan 110, atas 70, bawah 86 — semuanya persegi panjang.
const VX = SX + 46;
const HY = SY + 70;
const squareCrossOff: CutExample = {
  id: "square-cross-off",
  shape: "square",
  title: "Garis tegak + mendatar, tidak di tengah",
  how: "Garis vertikal dan horizontal tidak lewat titik tengah. Lihat, bagiannya tidak sama sisi.",
  result: "4 persegi panjang",
  detail:
    "Kalau garisnya tidak tepat di tengah, bagiannya tidak sama sisi. Persegi terurai menjadi 4 persegi panjang.",
  icons: ["rectangle", "rectangle", "rectangle", "rectangle"],
  whole: squareWhole,
  cuts: [
    [
      [VX, SY],
      [VX, SY + SS],
    ],
    [
      [SX, HY],
      [SX + SS, HY],
    ],
  ],
  pieces: polys(
    [
      [TL, [VX, SY], [VX, HY], [SX, HY]],
      [[VX, SY], TR, [SX + SS, HY], [VX, HY]],
      [[VX, HY], [SX + SS, HY], BR, [VX, SY + SS]],
      [[SX, HY], [VX, HY], [VX, SY + SS], BL],
    ],
    SC,
    14,
  ),
};

/* ===================== PERSEGI PANJANG ===================== */
/* 228 × 114, jadi potongan tegak di tengah = 2 persegi */

const RX = 36;
const RY = 58;
const RW = 228;
const RH = 114;
const RTL: Pt = [RX, RY];
const RTR: Pt = [RX + RW, RY];
const RBR: Pt = [RX + RW, RY + RH];
const RBL: Pt = [RX, RY + RH];
const RC: Pt = [RX + RW / 2, RY + RH / 2];
const rectWhole: WholeShape = {
  kind: "poly",
  points: [RTL, RTR, RBR, RBL],
  fill: SHAPE_COLOR.rectangle,
};

const rectDiag1: CutExample = {
  id: "rect-diag1",
  shape: "rectangle",
  title: "1 garis diagonal",
  how: "Sama seperti persegi: satu garis miring dari pojok ke pojok.",
  result: "2 segitiga",
  detail:
    "Satu garis diagonal mengurai persegi panjang menjadi 2 segitiga.",
  icons: ["triangle", "triangle"],
  whole: rectWhole,
  cuts: [[RTL, RBR]],
  pieces: polys(
    [
      [RTL, RTR, RBR],
      [RTL, RBR, RBL],
    ],
    RC,
    16,
  ),
};

const rectDiag2: CutExample = {
  id: "rect-diag2",
  shape: "rectangle",
  title: "2 garis diagonal",
  how: "Dua garis miring dari pojok ke pojok, bertemu di tengah.",
  result: "4 segitiga",
  detail:
    "Dua garis diagonal mengurai persegi panjang menjadi 4 segitiga.",
  icons: ["triangle", "triangle", "triangle", "triangle"],
  whole: rectWhole,
  cuts: [
    [RTL, RBR],
    [RTR, RBL],
  ],
  pieces: polys(
    [
      [RTL, RTR, RC],
      [RTR, RBR, RC],
      [RBR, RBL, RC],
      [RBL, RTL, RC],
    ],
    RC,
    14,
  ),
};

const rectVert: CutExample = {
  id: "rect-vert",
  shape: "rectangle",
  title: "1 garis vertikal",
  how: "Garis tegak tepat di tengah. Persegi panjang ini panjangnya dua kali lebarnya.",
  result: "2 persegi",
  detail:
    "Persegi panjang ini panjangnya dua kali lebarnya. Dipotong tegak di tengah, ia terurai menjadi 2 persegi.",
  icons: ["square", "square"],
  whole: rectWhole,
  cuts: [
    [
      [RC[0], RY],
      [RC[0], RY + RH],
    ],
  ],
  pieces: polys(
    [
      [RTL, [RC[0], RY], [RC[0], RY + RH], RBL],
      [[RC[0], RY], RTR, RBR, [RC[0], RY + RH]],
    ],
    RC,
    16,
  ),
};

const rectHoriz: CutExample = {
  id: "rect-horiz",
  shape: "rectangle",
  title: "1 garis horizontal",
  how: "Garis horizontal = garis mendatar, dari kiri ke kanan, tepat di tengah.",
  result: "2 persegi panjang",
  detail:
    "Satu garis mendatar di tengah mengurai persegi panjang menjadi 2 persegi panjang yang lebih pipih.",
  icons: ["rectangle", "rectangle"],
  whole: rectWhole,
  cuts: [
    [
      [RX, RC[1]],
      [RX + RW, RC[1]],
    ],
  ],
  pieces: polys(
    [
      [RTL, RTR, [RX + RW, RC[1]], [RX, RC[1]]],
      [[RX, RC[1]], [RX + RW, RC[1]], RBR, RBL],
    ],
    RC,
    16,
  ),
};

const rectCross: CutExample = {
  id: "rect-cross",
  shape: "rectangle",
  title: "Garis tegak + mendatar",
  how: "Satu garis vertikal dan satu garis horizontal, keduanya lewat tengah.",
  result: "4 persegi panjang",
  detail:
    "Dua garis itu mengurai persegi panjang menjadi 4 persegi panjang yang lebih kecil. Bukan persegi, karena ada sisi panjang dan sisi pendek.",
  icons: ["rectangle", "rectangle", "rectangle", "rectangle"],
  whole: rectWhole,
  cuts: [
    [
      [RC[0], RY],
      [RC[0], RY + RH],
    ],
    [
      [RX, RC[1]],
      [RX + RW, RC[1]],
    ],
  ],
  pieces: polys(
    [
      [RTL, [RC[0], RY], RC, [RX, RC[1]]],
      [[RC[0], RY], RTR, [RX + RW, RC[1]], RC],
      [RC, [RX + RW, RC[1]], RBR, [RC[0], RY + RH]],
      [[RX, RC[1]], RC, [RC[0], RY + RH], RBL],
    ],
    RC,
    14,
  ),
};

/* ===================== SEGITIGA ===================== */

const TA: Pt = [150, 30];
const TB: Pt = [46, 196];
const TC: Pt = [254, 196];
const TM: Pt = [150, 196];
const triWhole: WholeShape = {
  kind: "poly",
  points: [TA, TB, TC],
  fill: SHAPE_COLOR.triangle,
};
const triCenter: Pt = centroid([TA, TB, TC]);

const triHeight: CutExample = {
  id: "tri-height",
  shape: "triangle",
  title: "1 garis dari puncak",
  how: "Satu garis dari puncak ke tengah alas. Alas adalah sisi bawah.",
  result: "2 segitiga",
  detail:
    "Satu garis dari puncak ke tengah alas mengurai segitiga menjadi 2 segitiga.",
  icons: ["triangle", "triangle"],
  whole: triWhole,
  cuts: [[TA, TM]],
  pieces: polys(
    [
      [TA, TB, TM],
      [TA, TM, TC],
    ],
    triCenter,
    16,
  ),
};

const P1: Pt = [n(TB[0] + (TC[0] - TB[0]) / 3), 196];
const P2: Pt = [n(TB[0] + (2 * (TC[0] - TB[0])) / 3), 196];

const triTwo: CutExample = {
  id: "tri-two",
  shape: "triangle",
  title: "2 garis dari puncak",
  how: "Dua garis dari puncak ke alas, membagi alas menjadi 3 bagian.",
  result: "3 segitiga",
  detail: "Dua garis dari puncak mengurai segitiga menjadi 3 segitiga.",
  icons: ["triangle", "triangle", "triangle"],
  whole: triWhole,
  cuts: [
    [TA, P1],
    [TA, P2],
  ],
  pieces: polys(
    [
      [TA, TB, P1],
      [TA, P1, P2],
      [TA, P2, TC],
    ],
    triCenter,
    14,
  ),
};

const Mab: Pt = [n((TA[0] + TB[0]) / 2), n((TA[1] + TB[1]) / 2)];
const Mac: Pt = [n((TA[0] + TC[0]) / 2), n((TA[1] + TC[1]) / 2)];
const Mbc: Pt = [n((TB[0] + TC[0]) / 2), n((TB[1] + TC[1]) / 2)];

const triMid: CutExample = {
  id: "tri-mid",
  shape: "triangle",
  title: "Hubungkan titik tengah sisi",
  how: "Titik tengah setiap sisi dihubungkan. Ada 3 garis putus-putus.",
  result: "4 segitiga",
  detail:
    "Menghubungkan titik tengah ketiga sisi mengurai segitiga besar menjadi 4 segitiga kecil.",
  icons: ["triangle", "triangle", "triangle", "triangle"],
  whole: triWhole,
  cuts: [
    [Mab, Mac],
    [Mab, Mbc],
    [Mac, Mbc],
  ],
  pieces: polys(
    [
      [TA, Mab, Mac],
      [Mab, TB, Mbc],
      [Mac, Mbc, TC],
      [Mab, Mac, Mbc],
    ],
    triCenter,
    13,
  ),
};

/* ===================== SEGI LIMA ===================== */

const PC: Pt = [150, 122];
const pent = polyPoints(PC[0], PC[1], 84, 5, -90);
const pentWhole: WholeShape = {
  kind: "poly",
  points: pent,
  fill: SHAPE_COLOR.pentagon,
};

const pentOne: CutExample = {
  id: "pent-one",
  shape: "pentagon",
  title: "1 garis diagonal",
  how: "Satu garis dari satu pojok ke pojok yang tidak bersebelahan.",
  result: "1 segitiga dan 1 segi empat",
  detail:
    "Satu garis diagonal mengurai segi lima menjadi 1 segitiga dan 1 segi empat. Segi empat artinya bangun yang punya 4 sisi.",
  icons: ["triangle"],
  showSideNumbers: true,
  whole: pentWhole,
  cuts: [[pent[0], pent[2]]],
  pieces: polys(
    [
      [pent[0], pent[1], pent[2]],
      [pent[0], pent[2], pent[3], pent[4]],
    ],
    PC,
    14,
  ),
};

const pentVertex: CutExample = {
  id: "pent-vertex",
  shape: "pentagon",
  title: "2 garis dari satu pojok",
  how: "Dari satu pojok ditarik 2 garis ke pojok yang tidak bersebelahan.",
  result: "3 segitiga",
  detail: "Dua garis dari satu pojok mengurai segi lima menjadi 3 segitiga.",
  icons: ["triangle", "triangle", "triangle"],
  whole: pentWhole,
  cuts: [
    [pent[0], pent[2]],
    [pent[0], pent[3]],
  ],
  pieces: polys(
    [
      [pent[0], pent[1], pent[2]],
      [pent[0], pent[2], pent[3]],
      [pent[0], pent[3], pent[4]],
    ],
    PC,
    14,
  ),
};

const pentCenter: CutExample = {
  id: "pent-center",
  shape: "pentagon",
  title: "Dari titik tengah ke setiap pojok",
  how: "Ada 5 pojok, jadi ada 5 garis dari titik tengah.",
  result: "5 segitiga",
  detail:
    "Segi lima punya 5 pojok. Garis dari titik tengah ke setiap pojok mengurainya menjadi 5 segitiga.",
  icons: ["triangle", "triangle", "triangle", "triangle", "triangle"],
  whole: pentWhole,
  cuts: radii(pent, PC),
  pieces: fan(pent, PC, 13),
};

/* ===================== SEGI ENAM ===================== */

const HC: Pt = [150, 118];
const hex = polyPoints(HC[0], HC[1], 76, 6, 0);
const hexWhole: WholeShape = {
  kind: "poly",
  points: hex,
  fill: SHAPE_COLOR.hexagon,
};
const midTop: Pt = [
  n((hex[4][0] + hex[5][0]) / 2),
  n((hex[4][1] + hex[5][1]) / 2),
];
const midBot: Pt = [
  n((hex[1][0] + hex[2][0]) / 2),
  n((hex[1][1] + hex[2][1]) / 2),
];

const hexLong: CutExample = {
  id: "hex-long",
  shape: "hexagon",
  title: "1 garis dari pojok ke pojok",
  how: "Satu garis lurus dari pojok kiri ke pojok kanan, lewat tengah.",
  result: "2 segi empat",
  detail:
    "Satu garis dari pojok ke pojok yang berhadapan mengurai segi enam menjadi 2 segi empat. Setiap bagian punya 4 sisi.",
  showSideNumbers: true,
  whole: hexWhole,
  cuts: [[hex[3], hex[0]]],
  pieces: polys(
    [
      [hex[3], hex[4], hex[5], hex[0]],
      [hex[3], hex[0], hex[1], hex[2]],
    ],
    HC,
    15,
  ),
};

const hexVert: CutExample = {
  id: "hex-vert",
  shape: "hexagon",
  title: "1 garis vertikal",
  how: "Satu garis tegak di tengah, memotong sisi atas dan sisi bawah.",
  result: "2 segi lima",
  detail:
    "Setiap bagian punya 5 sisi: 1, 2, 3, 4, 5. Bangun dengan 5 sisi namanya segi lima.",
  icons: ["pentagon", "pentagon"],
  showSideNumbers: true,
  whole: hexWhole,
  cuts: [[midTop, midBot]],
  pieces: polys(
    [
      [midTop, hex[4], hex[3], hex[2], midBot],
      [midTop, hex[5], hex[0], hex[1], midBot],
    ],
    HC,
    16,
  ),
};

const hexCenter: CutExample = {
  id: "hex-center",
  shape: "hexagon",
  title: "Dari titik tengah ke setiap pojok",
  how: "Ada 6 pojok, jadi ada 6 garis dari titik tengah.",
  result: "6 segitiga",
  detail:
    "Segi enam punya 6 pojok. Dari titik tengah, ia terurai menjadi 6 segitiga yang sama besar.",
  icons: ["triangle", "triangle", "triangle", "triangle", "triangle", "triangle"],
  whole: hexWhole,
  cuts: radii(hex, HC),
  pieces: fan(hex, HC, 13),
};

/* ===================== LINGKARAN ===================== */

const CCX = 150;
const CCY = 118;
const CR = 68;
const circleWhole: WholeShape = {
  kind: "circle",
  cx: CCX,
  cy: CCY,
  r: CR,
  fill: SHAPE_COLOR.circle,
};

const east: Pt = [CCX + CR, CCY];
const north: Pt = [CCX, CCY - CR];
const west: Pt = [CCX - CR, CCY];
const south: Pt = [CCX, CCY + CR];

function wedge(a: Pt, b: Pt, sweep: 0 | 1, labelAt: Pt, dx: number, dy: number, i: number): PathPiece {
  return {
    kind: "path",
    d: `M ${CCX} ${CCY} L ${a[0]} ${a[1]} A ${CR} ${CR} 0 0 ${sweep} ${b[0]} ${b[1]} Z`,
    fill: FILLS[i % FILLS.length],
    dx,
    dy,
    delay: i * 0.06,
    labelAt,
  };
}

const circleHalf: CutExample = {
  id: "circle-half",
  shape: "circle",
  title: "1 garis lewat tengah",
  how: "Satu garis lurus lewat titik tengah (titik pusat). Bagiannya sama besar.",
  result: "2 setengah lingkaran",
  detail:
    "Satu garis lewat titik tengah membagi lingkaran menjadi 2 bagian yang sama besar. Namanya setengah lingkaran.",
  slice: "half",
  sliceCount: 2,
  whole: circleWhole,
  cuts: [[west, east]],
  pieces: [
    {
      kind: "path",
      d: `M ${west[0]} ${west[1]} A ${CR} ${CR} 0 0 0 ${east[0]} ${east[1]} Z`,
      fill: PAINT.sky,
      dx: 0,
      dy: -16,
      delay: 0,
      labelAt: [CCX, CCY - CR * 0.45],
    },
    {
      kind: "path",
      d: `M ${west[0]} ${west[1]} A ${CR} ${CR} 0 0 1 ${east[0]} ${east[1]} Z`,
      fill: PAINT.blue,
      dx: 0,
      dy: 16,
      delay: 0.06,
      labelAt: [CCX, CCY + CR * 0.45],
    },
  ],
};

const circleQuarter: CutExample = {
  id: "circle-quarter",
  shape: "circle",
  title: "2 garis lewat tengah",
  how: "Dua garis lewat titik tengah, seperti tanda tambah (+). Empat bagiannya sama besar.",
  result: "4 seperempat lingkaran",
  detail:
    "Dua garis lewat titik tengah membagi lingkaran menjadi 4 bagian yang sama besar. Setiap bagian disebut seperempat lingkaran.",
  slice: "quarter",
  sliceCount: 4,
  whole: circleWhole,
  cuts: [
    [west, east],
    [north, south],
  ],
  pieces: [
    wedge(east, north, 0, [CCX + 26, CCY - 26], 12, -12, 0),
    wedge(north, west, 0, [CCX - 26, CCY - 26], -12, -12, 1),
    wedge(west, south, 0, [CCX - 26, CCY + 26], -12, 12, 2),
    wedge(south, east, 0, [CCX + 26, CCY + 26], 12, 12, 3),
  ],
};

const CHORD_D = 26;
const chordX = CCX + CHORD_D;
const chordH = Math.sqrt(CR * CR - CHORD_D * CHORD_D);
const chordTop: Pt = [n(chordX), n(CCY - chordH)];
const chordBot: Pt = [n(chordX), n(CCY + chordH)];

const circleChord: CutExample = {
  id: "circle-chord",
  shape: "circle",
  title: "1 garis tidak lewat tengah",
  how: "Garisnya tidak lewat titik tengah. Perhatikan, dua bagiannya tidak sama besar.",
  result: "2 bagian tidak sama besar",
  detail:
    "Kalau garisnya tidak lewat titik tengah, dua bagiannya tidak sama besar. Supaya sama besar, garis harus lewat titik tengah!",
  whole: circleWhole,
  cuts: [[chordTop, chordBot]],
  pieces: [
    {
      kind: "path",
      d: `M ${chordTop[0]} ${chordTop[1]} A ${CR} ${CR} 0 1 0 ${chordBot[0]} ${chordBot[1]} Z`,
      fill: PAINT.sky,
      dx: -12,
      dy: 0,
      delay: 0,
      labelAt: [CCX - 18, CCY],
    },
    {
      kind: "path",
      d: `M ${chordTop[0]} ${chordTop[1]} A ${CR} ${CR} 0 0 1 ${chordBot[0]} ${chordBot[1]} Z`,
      fill: PAINT.orange,
      dx: 16,
      dy: 0,
      delay: 0.06,
      labelAt: [chordX + 20, CCY],
    },
  ],
};

export const cuts = {
  squareDiag1,
  squareDiag2,
  squareVert,
  squareCross,
  squareCrossOff,
  rectDiag1,
  rectDiag2,
  rectVert,
  rectHoriz,
  rectCross,
  triHeight,
  triTwo,
  triMid,
  pentOne,
  pentVertex,
  pentCenter,
  hexLong,
  hexVert,
  hexCenter,
  circleHalf,
  circleQuarter,
  circleChord,
};

export const LESSONS: LessonGroup[] = [
  {
    kind: "square",
    intro:
      "Persegi punya 4 sisi yang sama panjang. Kita bisa memotongnya dengan garis miring (diagonal), garis tegak (vertikal), atau garis mendatar (horizontal).",
    remember:
      "Tepat di tengah → 4 persegi. Tidak di tengah → 4 persegi panjang. 1 garis miring → 2 segitiga. 2 garis miring → 4 segitiga.",
    examples: [squareDiag1, squareDiag2, squareVert, squareCross, squareCrossOff],
  },
  {
    kind: "rectangle",
    intro:
      "Persegi panjang punya 2 sisi panjang dan 2 sisi pendek. Ia juga bisa diurai dengan garis miring, tegak, atau mendatar.",
    remember:
      "1 garis miring → 2 segitiga. 2 garis miring → 4 segitiga. Garis tegak di tengah (kalau panjangnya dua kali lebar) → 2 persegi. Garis tegak + mendatar → 4 persegi panjang.",
    examples: [rectDiag1, rectDiag2, rectVert, rectHoriz, rectCross],
  },
  {
    kind: "triangle",
    intro:
      "Segitiga punya 3 sisi dan 3 sudut. Kalau dipotong, ia bisa menjadi segitiga-segitiga yang lebih kecil.",
    remember:
      "1 garis dari puncak → 2 segitiga. 2 garis dari puncak → 3 segitiga. Hubungkan titik tengah sisi → 4 segitiga.",
    examples: [triHeight, triTwo, triMid],
  },
  {
    kind: "pentagon",
    intro:
      "Segi lima punya 5 sisi dan 5 sudut. Kita bisa mengurainya menjadi segitiga.",
    remember:
      "1 garis diagonal → 1 segitiga dan 1 segi empat. 2 garis dari satu pojok → 3 segitiga. Dari titik tengah → 5 segitiga.",
    examples: [pentOne, pentVertex, pentCenter],
  },
  {
    kind: "hexagon",
    intro:
      "Segi enam punya 6 sisi dan 6 sudut. Ia bisa diurai menjadi segi empat, segi lima, atau segitiga.",
    remember:
      "1 garis pojok ke pojok → 2 segi empat. 1 garis tegak di tengah → 2 segi lima. Dari titik tengah → 6 segitiga.",
    examples: [hexLong, hexVert, hexCenter],
  },
  {
    kind: "circle",
    intro:
      "Lingkaran bulat dan tidak punya sudut. Garis potongnya harus lewat titik tengah supaya bagiannya sama besar.",
    remember:
      "1 garis lewat tengah → 2 setengah lingkaran. 2 garis lewat tengah → 4 seperempat lingkaran. Tidak lewat tengah → bagiannya tidak sama besar.",
    examples: [circleHalf, circleQuarter, circleChord],
  },
];

