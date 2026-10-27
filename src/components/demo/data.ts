import type { ActionCard, Category } from "./types";

// 실제 가족 정보가 아닌 화면 시연용 데이터입니다.
export const DUMMY_CARDS: ActionCard[] = [
  {
    id: "c1",
    title: "어버이날 선물 준비",
    category: "선물",
    due: "5월 1일",
    status: "가족 의견 대기",
    owner: "나",
    members: ["엄마", "아빠", "동생"],
    checklist: [
      { text: "선물 후보 정하기", done: true },
      { text: "가족 의견 받기", done: false },
      { text: "예산 정하기", done: false },
      { text: "구매 여부 확인하기", done: false },
      { text: "부모님께 전달하기", done: false },
    ],
    comments: [{ who: "동생", text: "마사지기 좋을 것 같아" }],
  },
  {
    id: "c2",
    title: "가족 식사 날짜 조율",
    category: "모임",
    due: "이번 주 일요일",
    status: "날짜 선택 중",
    owner: "나",
    members: ["엄마", "아빠", "동생"],
    checklist: [
      { text: "날짜 후보 정하기", done: true },
      { text: "가족 가능 날짜 확인하기", done: false },
      { text: "식당 후보 정하기", done: false },
      { text: "예약 담당자 정하기", done: false },
      { text: "예약 완료 확인하기", done: false },
    ],
    comments: [
      { who: "엄마", text: "토요일이 좋아요" },
      { who: "동생", text: "일요일 저녁 가능해" },
      { who: "아빠", text: "가까운 곳이면 좋아요" },
    ],
  },
  {
    id: "c3",
    title: "아빠 건강검진 예약 확인",
    category: "건강검진",
    due: "7월 3일",
    status: "확인 필요",
    owner: "나",
    members: ["아빠"],
    checklist: [
      { text: "검진 날짜 확인하기", done: true },
      { text: "예약 여부 확인하기", done: false },
      { text: "준비사항 확인하기", done: false },
      { text: "결과 확인 여부 체크하기", done: false },
      { text: "다음 검진 주기 등록하기", done: false },
    ],
    comments: [],
  },
];

export const CATEGORY_META: Record<Category, { emoji: string; tint: string }> = {
  모임: { emoji: "🍽️", tint: "bg-[oklch(0.95_0.04_60)] text-[oklch(0.4_0.08_50)]" },
  기념일: { emoji: "🎂", tint: "bg-primary-soft text-primary" },
  명절: { emoji: "🌕", tint: "bg-[oklch(0.94_0.05_80)] text-[oklch(0.4_0.08_70)]" },
  건강검진: { emoji: "🩺", tint: "bg-[oklch(0.94_0.04_200)] text-[oklch(0.38_0.07_220)]" },
  선물: { emoji: "🎁", tint: "bg-[oklch(0.95_0.04_20)] text-[oklch(0.42_0.1_25)]" },
};
