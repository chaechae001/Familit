import type { createClient } from "@/lib/supabase/server";

// 로그인한 사용자가 가족 그룹을 만들었는지 확인 (온보딩 완료 여부 판단용)
export async function getMyFamilyGroup(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from("family_groups")
    .select("id, name")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
