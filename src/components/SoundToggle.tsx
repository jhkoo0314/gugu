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
      className={`mini-button gap-2 ${
        soundEnabled
          ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)]"
      }`}
    >
      <span>{soundEnabled ? "효과음 켜짐" : "효과음 꺼짐"}</span>
    </button>
  );
}
