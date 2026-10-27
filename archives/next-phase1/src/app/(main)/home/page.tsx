// AI 케어보드 (홈) — 캘린더가 아니라 "오늘 챙겨야 할 가족 케어"가 먼저 보이는 화면.

import Link from "next/link";
import { Plus, Sparkles, ChevronRight } from "lucide-react";
import { CareCardItem } from "@/components/care/CareCardItem";
import { mockCareCards, mockFamilyMembers } from "@/lib/mock/data";
import { daysUntil } from "@/lib/care/meta";

export default function HomePage() {
  const pendingCards = mockCareCards
    .filter((c) => c.status !== "done")
    .sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));

  // 긴급: 우선순위가 긴급이거나 마감이 3일 이내인 카드
  const urgentCards = pendingCards.filter((c) => {
    if (c.priority === "urgent") return true;
    const d = daysUntil(c.due_date);
    return d !== null && d <= 3;
  });

  // 이번 주: 긴급에 포함되지 않은, 마감 7일 이내 카드
  const urgentIds = new Set(urgentCards.map((c) => c.id));
  const thisWeekCards = pendingCards.filter((c) => {
    if (urgentIds.has(c.id)) return false;
    const d = daysUntil(c.due_date);
    return d !== null && d <= 7;
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-ink-muted">오늘의 가족 케어</p>
        <h1 className="text-2xl font-bold text-forest">
          이번 주 챙길 일 {urgentCards.length + thisWeekCards.length}건이 있어요
        </h1>
      </header>

      {/* 긴급 카드 */}
      {urgentCards.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-urgent">지금 챙겨야 해요</h2>
          <div className="space-y-3">
            {urgentCards.map((card) => (
              <CareCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* 이번 주 케어 카드 */}
      {thisWeekCards.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">이번 주 케어 카드</h2>
            <Link href="/cards" className="flex items-center text-sm text-ink-muted">
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {thisWeekCards.map((card) => (
              <CareCardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* 가족별 케어 현황 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">가족별 케어 현황</h2>
          <Link href="/family" className="flex items-center text-sm text-ink-muted">
            가족 관리 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {mockFamilyMembers.map((member) => {
            const count = pendingCards.filter((c) => c.family_member_id === member.id).length;
            return (
              <Link key={member.id} href="/family" className="care-card flex flex-col gap-1">
                <p className="font-semibold text-ink">
                  {member.name}
                  <span className="ml-1 text-sm text-ink-muted">· {member.relation}</span>
                </p>
                <p className="text-sm text-ink-muted">
                  챙길 일 <span className="font-semibold text-forest">{count}건</span>
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 빠른 액션 */}
      <section className="grid grid-cols-2 gap-3 pb-2">
        <Link
          href="/cards"
          className="care-card flex flex-col items-center justify-center gap-2 text-center"
        >
          <Plus className="text-forest" />
          <span className="font-semibold text-ink">케어 카드 추가</span>
        </Link>
        <Link
          href="/routines"
          className="care-card flex flex-col items-center justify-center gap-2 text-center bg-mint-soft"
        >
          <Sparkles className="text-forest" />
          <span className="font-semibold text-forest">AI 루틴 추천 받기</span>
        </Link>
      </section>
    </div>
  );
}
