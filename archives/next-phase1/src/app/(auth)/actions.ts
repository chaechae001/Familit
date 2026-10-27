"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyFamilyGroup } from "@/lib/supabase/queries/familyGroups";
import { loginSchema, signupSchema } from "@/schemas/auth";

export type AuthFieldErrors = Partial<
  Record<"name" | "email" | "password" | "passwordConfirm", string[]>
>;

export type AuthActionResult = {
  error?: string;
  message?: string;
  fieldErrors?: AuthFieldErrors;
};

export const initialAuthState: AuthActionResult = {};

export async function signIn(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않아요." };
  }

  const group = await getMyFamilyGroup(supabase);
  redirect(group ? "/home" : "/onboarding");
}

export async function signUp(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { name: parsed.data.name } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "이미 가입된 이메일이에요." };
    }
    return { error: "회원가입에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  // 이메일 확인이 필요한 환경에서는 가입 직후 세션이 생성되지 않음
  if (!data.session) {
    return {
      message: "확인 이메일을 보냈어요. 메일함에서 인증 후 로그인해주세요.",
    };
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
