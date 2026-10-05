import { useState } from "react";
import { cn } from "../utils/cn";
import { sfx } from "../utils/sound";

export function SoundToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState(sfx.isMuted());

  return (
    <button
      type="button"
      aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
      title={muted ? "Nyalakan suara" : "Matikan suara"}
      onClick={() => {
        const next = !muted;
        sfx.setMuted(next);
        setMuted(next);
        if (!next) sfx.click();
      }}
      className={cn(
        "btn-toy btn-blue grid h-11 w-11 shrink-0 place-items-center rounded-full text-xl",
        className,
      )}
    >
      <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
    </button>
  );
}
