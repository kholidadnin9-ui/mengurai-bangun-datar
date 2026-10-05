// Efek suara sederhana memakai WebAudio (tanpa file audio)
let ctx: AudioContext | null = null;
let muted = false;

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

function getCtx(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const w = window as WindowWithWebkit;
      const Ctor = window.AudioContext || w.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.16,
) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const t0 = c.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  isMuted: () => muted,
  setMuted(value: boolean) {
    muted = value;
    if (value && "speechSynthesis" in window) window.speechSynthesis.cancel();
  },
  click() {
    tone(520, 0, 0.08, "triangle", 0.12);
  },
  snip() {
    tone(980, 0, 0.05, "square", 0.05);
    tone(620, 0.04, 0.07, "triangle", 0.1);
    tone(880, 0.1, 0.1, "triangle", 0.1);
  },
  correct() {
    tone(660, 0, 0.14, "triangle");
    tone(880, 0.12, 0.14, "triangle");
    tone(1100, 0.24, 0.26, "triangle");
  },
  wrong() {
    tone(260, 0, 0.18, "sawtooth", 0.1);
    tone(200, 0.16, 0.26, "sawtooth", 0.1);
  },
  win() {
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) =>
      tone(f, i * 0.13, 0.22, "triangle", 0.15),
    );
  },
};

/** Membacakan teks soal (bahasa Indonesia) untuk membantu anak yang belum lancar membaca. */
export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string) {
  if (!canSpeak() || muted) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "id-ID";
  u.rate = 0.9;
  u.pitch = 1.1;
  synth.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
