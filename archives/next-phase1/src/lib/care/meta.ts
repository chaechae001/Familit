import {
  Stethoscope,
  Salad,
  Smartphone,
  ShieldCheck,
  Receipt,
  PartyPopper,
  Gift,
  Plane,
  ClipboardList,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CareCategory, CardPriority, CardStatus } from "@/types/database";

export const CATEGORY_META: Record<CareCategory, { label: string; icon: LucideIcon }> = {
  health_checkup: { label: "건강검진", icon: Stethoscope },
  diet_care: { label: "식단 관리", icon: Salad },
  telecom: { label: "통신요금", icon: Smartphone },
  insurance: { label: "보험", icon: ShieldCheck },
  utility_bill: { label: "공과금", icon: Receipt },
  family_event: { label: "경조사", icon: PartyPopper },
  gift: { label: "선물", icon: Gift },
  travel: { label: "여행", icon: Plane },
  household_task: { label: "생활 업무", icon: ClipboardList },
  family_meeting: { label: "가족 모임", icon: Users },
  custom: { label: "기타", icon: Sparkles },
};

export const PRIORITY_META: Record<CardPriority, { label: string; className: string }> = {
  urgent: { label: "긴급", className: "bg-urgent text-white" },
  high: { label: "높음", className: "bg-forest text-white" },
  medium: { label: "보통", className: "bg-mint-soft text-forest" },
  low: { label: "낮음", className: "bg-ivory-deep text-ink-muted" },
};

export const STATUS_META: Record<CardStatus, { label: string }> = {
  todo: { label: "할 일" },
  doing: { label: "진행중" },
  done: { label: "완료" },
  postponed: { label: "연기" },
};

// 마감일까지 남은 일수 (음수면 마감 지남)
export function daysUntil(dueDate: string | null): number | null {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// 마감일까지 남은 일수를 D-day 형태 문구로 변환 (예: D-3, D-DAY, D+2)
export function formatDday(dueDate: string | null): string | null {
  const diffDays = daysUntil(dueDate);
  if (diffDays === null) return null;

  if (diffDays === 0) return "D-DAY";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
