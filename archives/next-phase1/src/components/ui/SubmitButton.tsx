"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-card bg-forest px-4 py-3 text-center text-lg font-semibold text-white disabled:opacity-60"
    >
      {pending ? "처리 중..." : children}
    </button>
  );
}
