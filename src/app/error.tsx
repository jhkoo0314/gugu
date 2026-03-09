"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route render error:", error);
  }, [error]);

  return (
    <main className="page-shell">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="app-shell">
          <div className="soft-card-pink">
            <p className="accent-badge bg-white/75 text-[var(--color-text-secondary)]">문제가 생겼어요</p>
            <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-text-primary)] sm:text-4xl">
              화면을 다시 불러올게요
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              휴대폰 브라우저에서 처리 중 문제가 생겼어요. 아래 버튼으로 다시 시도해보세요.
            </p>
          </div>
        </section>
        <button type="button" onClick={reset} className="primary-button mx-auto w-full max-w-sm">
          다시 시도하기
        </button>
      </div>
    </main>
  );
}
