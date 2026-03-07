type QuestionCardProps = {
  multiplicand: number;
  multiplier: number;
};

export function QuestionCard({ multiplicand, multiplier }: QuestionCardProps) {
  return (
    <section className="rounded-[32px] bg-[linear-gradient(180deg,rgba(255,241,246,0.95),rgba(255,255,255,0.95))] p-6 text-center shadow-[0_18px_50px_rgba(201,182,255,0.18)]">
      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">문제를 보고 답을 골라봐요</p>
      <p className="mt-4 text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
        {multiplicand} × {multiplier}
      </p>
      <p className="mt-2 text-3xl font-bold text-[var(--color-brand-secondary)]">= ?</p>
    </section>
  );
}
