// AI 케어보드 (홈) — 캘린더가 아니라 "오늘 챙겨야 할 가족 케어"가 먼저 보이는 화면.
// Phase 0에서는 골격만. 실제 케어보드 요약/카드 그리드는 Phase 2에서 구현합니다.

export default function HomePage() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-ink-muted">오늘의 가족 케어</p>
        <h1 className="text-2xl font-bold text-forest">
          이번 주 챙길 일을 모아드릴게요
        </h1>
      </header>

      <section className="care-card">
        <p className="text-ink-muted">
          가족을 등록하면 AI가 챙겨야 할 일을 케어 카드로 정리해줍니다.
        </p>
      </section>

      <section className="rounded-card bg-mint-soft p-4">
        <p className="font-semibold text-forest-700">Phase 0 세팅 완료 ✓</p>
        <p className="mt-1 text-ink-muted">
          이 화면이 보이면 Next.js · Tailwind · Supabase 연결 골격이 정상입니다.
        </p>
      </section>
    </div>
  );
}
