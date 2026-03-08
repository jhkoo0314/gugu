type MascotBubbleProps = {
  message: string;
  tone?: "pink" | "lavender" | "yellow";
  align?: "left" | "right";
};

function getToneClassName(tone: MascotBubbleProps["tone"]): string {
  switch (tone) {
    case "lavender":
      return "bg-[var(--color-soft-lavender)] text-[var(--color-text-primary)]";
    case "yellow":
      return "bg-[var(--color-soft-yellow)] text-[var(--color-text-primary)]";
    default:
      return "bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]";
  }
}

export function MascotBubble({ message, tone = "pink", align = "right" }: MascotBubbleProps) {
  return (
    <div className={`flex items-end gap-3 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {align === "left" ? <MascotFace /> : null}
      <div className={`fade-up-enter max-w-[220px] rounded-[24px] px-4 py-3 text-sm font-bold shadow-[0_12px_28px_rgba(91,85,102,0.08)] ${getToneClassName(tone)}`}>
        {message}
      </div>
      {align === "right" ? <MascotFace /> : null}
    </div>
  );
}

function MascotFace() {
  return (
    <div className="mascot-shell float-soft" aria-hidden="true">
      <span className="absolute left-4 top-[-10px] h-8 w-6 rounded-full border border-white/70 bg-[var(--color-soft-pink)]" />
      <span className="absolute right-4 top-[-10px] h-8 w-6 rounded-full border border-white/70 bg-[var(--color-soft-pink)]" />
      <div className="mascot-bunny">
        <span className="absolute left-3 top-6 h-1.5 w-1.5 rounded-full bg-[var(--color-text-primary)]" />
        <span className="absolute right-3 top-6 h-1.5 w-1.5 rounded-full bg-[var(--color-text-primary)]" />
        <span className="absolute left-1/2 top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--color-brand-primary)]" />
        <span className="absolute left-1/2 top-10 h-2 w-3 -translate-x-1/2 rounded-full border-b-2 border-[var(--color-text-secondary)]" />
      </div>
    </div>
  );
}
