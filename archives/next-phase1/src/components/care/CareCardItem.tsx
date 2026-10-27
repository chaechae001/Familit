import Link from "next/link";
import type { CareCard } from "@/types/database";
import { CATEGORY_META, PRIORITY_META, STATUS_META, formatDday, formatDate } from "@/lib/care/meta";
import { getMemberById } from "@/lib/mock/data";

// 케어 카드 1건을 보여주는 공용 카드 — 홈/케어카드 목록에서 재사용
export function CareCardItem({ card }: { card: CareCard }) {
  const category = CATEGORY_META[card.category];
  const priority = PRIORITY_META[card.priority];
  const member = getMemberById(card.family_member_id);
  const dday = formatDday(card.due_date);
  const Icon = category.icon;

  return (
    <Link href={`/cards/${card.id}`} className="care-card flex flex-col gap-2 active:opacity-80">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Icon size={16} />
          <span>{category.label}</span>
          <span>· {member ? member.name : "가족 전체"}</span>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${priority.className}`}>
          {priority.label}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-ink">{card.title}</h3>

      <div className="flex items-center justify-between text-sm text-ink-muted">
        {card.due_date ? (
          <span>
            <span className="font-semibold text-forest">{dday}</span>
            {"  "}
            {formatDate(card.due_date)} 마감
          </span>
        ) : (
          <span>마감일 없음</span>
        )}
        {card.status !== "todo" && (
          <span className="rounded-full bg-ivory-deep px-2 py-0.5 text-xs font-medium text-ink-muted">
            {STATUS_META[card.status].label}
          </span>
        )}
      </div>
    </Link>
  );
}
