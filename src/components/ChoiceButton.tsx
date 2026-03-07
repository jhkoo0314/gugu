type ChoiceButtonProps = {
  value: number;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onClick: () => void;
};

export function ChoiceButton({
  value,
  disabled,
  isSelected,
  isCorrect,
  isWrong,
  onClick
}: ChoiceButtonProps) {
  let className =
    "w-full rounded-[24px] border bg-white px-5 py-4 text-left text-xl font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200";

  if (!disabled) {
    className +=
      " border-[var(--color-border)] hover:-translate-y-0.5 hover:border-[var(--color-brand-secondary)] hover:bg-[var(--color-soft-lavender)]";
  }

  if (isCorrect) {
    className += " border-[var(--color-success)] bg-[var(--color-success-soft)]";
  } else if (isWrong) {
    className += " border-[var(--color-error)] bg-[var(--color-error-soft)]";
  } else if (isSelected) {
    className += " border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)]";
  }

  if (disabled) {
    className += " cursor-not-allowed";
  }

  return (
    <button type="button" disabled={disabled} onClick={onClick} className={className}>
      <span className="flex items-center justify-between gap-3">
        <span>{value}</span>
        {isCorrect ? <span className="text-sm font-semibold">정답</span> : null}
        {isWrong ? <span className="text-sm font-semibold">다시 보기</span> : null}
      </span>
    </button>
  );
}
