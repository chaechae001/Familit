// 패밀릿 DB 타입.
// 손으로 작성한 초기 버전이며, 스키마 변경 후에는
//   npm run types  (supabase gen types)
// 로 자동 재생성하는 것을 권장합니다.

export type DigitalLiteracyLevel = "low" | "medium" | "high";

export type CareCategory =
  | "health_checkup"
  | "diet_care"
  | "telecom"
  | "insurance"
  | "utility_bill"
  | "family_event"
  | "gift"
  | "travel"
  | "household_task"
  | "family_meeting"
  | "custom";

export type CardPriority = "low" | "medium" | "high" | "urgent";
export type CardStatus = "todo" | "doing" | "done" | "postponed";
export type RepeatType = "none" | "weekly" | "monthly" | "yearly" | "custom";
export type CardSource = "manual" | "ai_generated" | "routine";
export type AiRecType = "routine" | "card" | "diet";
export type ShareChannel = "web_share" | "copy";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export interface User extends Timestamps {
  id: string;
  name: string;
}

export interface FamilyGroup extends Timestamps {
  id: string;
  owner_user_id: string;
  name: string;
}

export interface FamilyMember extends Timestamps {
  id: string;
  family_group_id: string;
  name: string;
  relation: string | null;
  birth_date: string | null;
  age: number | null;
  location: string | null;
  phone: string | null;
  digital_literacy_level: DigitalLiteracyLevel;
  health_notes: string | null;
  chronic_conditions: string | null;
  diet_notes: string | null;
  medication_notes: string | null;
  checkup_cycle_months: number | null;
  telecom_provider: string | null;
  telecom_plan_memo: string | null;
  insurance_memo: string | null;
  utility_payment_memo: string | null;
  care_priority: CardPriority;
}

export interface CareCard extends Timestamps {
  id: string;
  family_group_id: string;
  family_member_id: string | null;
  owner_user_id: string | null;
  title: string;
  description: string | null;
  category: CareCategory;
  priority: CardPriority;
  status: CardStatus;
  due_date: string | null;
  repeat_type: RepeatType;
  suggested_action: string | null;
  memo: string | null;
  source: CardSource;
  completed_at: string | null;
}

export interface CareRoutine extends Timestamps {
  id: string;
  family_group_id: string;
  family_member_id: string | null;
  title: string;
  category: CareCategory;
  repeat_rule: string | null;
  next_due_date: string | null;
  default_checklist: { content: string }[];
  is_active: boolean;
  created_by_ai: boolean;
}

export interface CareChecklist extends Timestamps {
  id: string;
  care_card_id: string;
  content: string;
  is_done: boolean;
  order_index: number;
}

export interface CareLog extends Timestamps {
  id: string;
  family_group_id: string;
  family_member_id: string | null;
  care_card_id: string | null;
  category: CareCategory | null;
  title: string;
  completed_at: string;
}

export interface AiRecommendation extends Timestamps {
  id: string;
  family_group_id: string;
  family_member_id: string | null;
  type: AiRecType;
  input_text: string | null;
  result: Record<string, unknown>;
  is_accepted: boolean;
}

export interface ShareLog extends Timestamps {
  id: string;
  family_group_id: string;
  owner_user_id: string | null;
  content: string;
  channel: ShareChannel;
}

// Supabase 제네릭 클라이언트가 기대하는 형태
export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: Partial<User> & { id: string; name: string }; Update: Partial<User> };
      family_groups: { Row: FamilyGroup; Insert: Omit<FamilyGroup, "id" | keyof Timestamps> & { id?: string }; Update: Partial<FamilyGroup> };
      family_members: { Row: FamilyMember; Insert: Omit<FamilyMember, "id" | keyof Timestamps> & { id?: string }; Update: Partial<FamilyMember> };
      care_cards: { Row: CareCard; Insert: Omit<CareCard, "id" | keyof Timestamps> & { id?: string }; Update: Partial<CareCard> };
      care_routines: { Row: CareRoutine; Insert: Omit<CareRoutine, "id" | keyof Timestamps> & { id?: string }; Update: Partial<CareRoutine> };
      care_checklists: { Row: CareChecklist; Insert: Omit<CareChecklist, "id" | keyof Timestamps> & { id?: string }; Update: Partial<CareChecklist> };
      care_logs: { Row: CareLog; Insert: Omit<CareLog, "id" | keyof Timestamps> & { id?: string }; Update: Partial<CareLog> };
      ai_recommendations: { Row: AiRecommendation; Insert: Omit<AiRecommendation, "id" | keyof Timestamps> & { id?: string }; Update: Partial<AiRecommendation> };
      share_logs: { Row: ShareLog; Insert: Omit<ShareLog, "id" | keyof Timestamps> & { id?: string }; Update: Partial<ShareLog> };
    };
  };
};
