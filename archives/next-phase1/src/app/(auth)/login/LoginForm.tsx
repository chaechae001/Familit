"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, initialAuthState } from "../actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialAuthState);

  return (
    <form action={formAction} className="w-full space-y-4">
      <TextField
        label="이메일"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="example@email.com"
        errors={state.fieldErrors?.email}
      />
      <TextField
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호"
        errors={state.fieldErrors?.password}
      />

      {state.error && <p className="text-sm text-urgent">{state.error}</p>}

      <SubmitButton>로그인</SubmitButton>

      <p className="text-center text-ink-muted">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-semibold text-forest">
          회원가입
        </Link>
      </p>
    </form>
  );
}
