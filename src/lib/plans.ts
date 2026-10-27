export type PlanId = "free" | "plus";

export type Plan = {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  priceLabel: string;
  billingNote: string;
  features: string[];
  recommended?: boolean;
};

export const plans: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Familit Free",
    description: "가족과 함께 챙기는 습관을 가볍게 시작해요.",
    price: 0,
    priceLabel: "무료",
    billingNote: "계속 무료",
    features: [
      "가족 그룹 1개",
      "진행 중인 가족 액션 카드 5개",
      "기본 체크리스트와 역할 분담",
      "가족 확인·완료 상태 공유",
    ],
  },
  plus: {
    id: "plus",
    name: "Familit Plus",
    description: "반복되는 가족 일을 AI와 함께 빠짐없이 끝내요.",
    price: 4900,
    priceLabel: "4,900원",
    billingNote: "1개월 이용권 · 자동 갱신 없음",
    recommended: true,
    features: [
      "진행 중인 가족 액션 카드 무제한",
      "AI 준비목록·체크리스트 추천",
      "가족 상황에 맞는 역할 제안",
      "확인 요청과 리마인드",
      "완료 기록과 가족 아카이브",
    ],
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return value === "free" || value === "plus";
}

export function formatWon(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}
