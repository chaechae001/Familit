"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, initialAuthState } from "../actions";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, initialAuthState);

  return (
    <form action={formAction} className="w-full space-y-4">
      <TextField
        label="이름"
        name="name"
        type="text"
        autoComplete="name"
        placeholder="홍길동"
        errors={state.fieldErrors?.name}
      />
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
        autoComplete="new-password"
        placeholder="6자 이상"
        errors={state.fieldErrors?.password}
      />
      <TextField
        label="비밀번호 확인"
        name="passwordConfirm"
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호 재입력"
        errors={state.fieldErrors?.passwordConfirm}
      />

      {state.error && <p className="text-sm text-urgent">{state.error}</p>}
      {state.message && <p className="text-sm text-forest">{state.message}</p>}

      <SubmitButton>회원가입</SubmitButton>

      <p className="text-center text-ink-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-forest">
          로그인
        </Link>
      </p>
    </form>
  );
}
