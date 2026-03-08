type QuestionCardProps = {
  multiplicand: number;
  multiplier: number;
};

export function QuestionCard({ multiplicand, multiplier }: QuestionCardProps) {
  return (
    <section className="soft-card relative overflow-hidden p-6 text-center shadow-[0_18px_50px_rgba(201,182,255,0.18)]">
      <div className="absolute left-[-18px] top-[-22px] h-20 w-20 rounded-full bg-[rgba(255,143,177,0.1)] blur-2xl" aria-hidden="true" />
      <div className="absolute bottom-[-22px] right-[-12px] h-24 w-24 rounded-full bg-[rgba(201,182,255,0.1)] blur-2xl" aria-hidden="true" />
      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">문제를 보고 차분하게 답을 골라봐요</p>
      <p className="mt-4 text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-6xl">
        {multiplicand} × {multiplier}
      </p>
      <p className="mt-3 inline-flex rounded-full bg-[var(--color-soft-lavender)] px-5 py-2 text-3xl font-bold text-[var(--color-brand-secondary)]">= ?</p>
    </section>
  );
}
