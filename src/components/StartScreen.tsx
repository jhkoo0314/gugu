import Link from "next/link";
import type { DanOption } from "@/types/quiz";

type StartScreenProps = {
  selectedDan: DanOption | null;
  onSelectDan: (dan: DanOption) => void;
  onStart: () => void;
};

const DAN_OPTIONS: DanOption[] = [2, 3, 4, 5, 6, 7, 8, 9, "all"];

function getDanLabel(dan: DanOption): string {
  return dan === "all" ? "전체 섞기" : `${dan}단`;
}

export function StartScreen({ selectedDan, onSelectDan, onStart }: StartScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-xl rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(255,143,177,0.2)] backdrop-blur sm:p-6">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-[var(--color-soft-pink)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)]">
            반짝반짝 구구단 시간
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            구구단 연습장
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-[var(--color-text-secondary)]">
            오늘은 몇 단을 연습해볼까?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="연습할 단 선택">
          {DAN_OPTIONS.map((dan) => {
            const isSelected = selectedDan === dan;
            const isFullWidth = dan === "all";

            return (
              <button
                key={dan}
                type="button"
                onClick={() => onSelectDan(dan)}
                role="radio"
                aria-checked={isSelected}
                className={`min-h-[72px] rounded-[24px] border px-4 py-3 text-base font-semibold transition-transform duration-200 ${
                  isFullWidth ? "col-span-2 sm:col-span-1" : ""
                } ${
                  isSelected
                    ? "border-[var(--color-brand-primary)] bg-[var(--color-soft-pink)] text-[var(--color-text-primary)] shadow-[0_14px_32px_rgba(255,143,177,0.24)]"
                    : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:-translate-y-0.5 hover:border-[var(--color-brand-secondary)] hover:bg-[var(--color-soft-lavender)]"
                }`}
              >
                {getDanLabel(dan)}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm font-medium text-[var(--color-text-secondary)]" aria-live="polite">
          {selectedDan === null
            ? "먼저 연습할 단을 골라주세요."
            : `${getDanLabel(selectedDan)} 연습을 시작할 준비가 됐어요.`}
        </p>

        <button
          type="button"
          onClick={onStart}
          disabled={selectedDan === null}
          className="mt-8 min-h-[56px] w-full rounded-full bg-[var(--color-brand-primary)] px-6 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(255,143,177,0.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-[var(--color-disabled)] disabled:text-[var(--color-text-muted)] disabled:shadow-none"
        >
          시작하기
        </button>

        <Link
          href="/all-dan"
          className="mt-3 flex min-h-[56px] w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-6 py-4 text-lg font-bold text-[var(--color-text-primary)] shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-soft-lavender)]"
        >
          전체 구구단 보러 가기
        </Link>
      </section>
    </main>
  );
}
