type SoundToggleProps = {
  soundEnabled: boolean;
  onToggle: () => void;
};

export function SoundToggle({ soundEnabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={soundEnabled}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 ${
        soundEnabled
          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
      }`}
    >
      <span>{soundEnabled ? "효과음 켜짐" : "효과음 꺼짐"}</span>
    </button>
  );
}
