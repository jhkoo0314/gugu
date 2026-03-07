type ScoreBoardProps = {
  correctCount: number;
  wrongCount: number;
  accuracy: number;
};

type ScoreItemProps = {
  label: string;
  value: string;
  accentClassName: string;
};

function ScoreItem({ label, value, accentClassName }: ScoreItemProps) {
  return (
    <div className={`rounded-[24px] p-4 shadow-sm ${accentClassName}`}>
      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

export function ScoreBoard({ correctCount, wrongCount, accuracy }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <ScoreItem
        label="정답"
        value={`${correctCount}개`}
        accentClassName="bg-[var(--color-success-soft)]"
      />
      <ScoreItem label="오답" value={`${wrongCount}개`} accentClassName="bg-[var(--color-error-soft)]" />
      <div className="col-span-2 sm:col-span-1">
        <ScoreItem
          label="정답률"
          value={`${accuracy}%`}
          accentClassName="bg-[var(--color-soft-yellow)]"
        />
      </div>
    </div>
  );
}
