export type ScreenId =
  | "onboarding"
  | "group"
  | "board"
  | "create"
  | "ai"
  | "cardDetail"
  | "gift"
  | "meeting"
  | "health"
  | "parent"
  | "beta"
  | "menu";

export type Category = "모임" | "기념일" | "명절" | "건강검진" | "선물";

export type ActionCard = {
  id: string;
  title: string;
  category: Category;
  due: string;
  status: string;
  owner: string;
  members: string[];
  checklist: { text: string; done: boolean }[];
  comments: { who: string; text: string }[];
};
