import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, RotateCcw } from "lucide-react";
import { z } from "zod";
import { PaymentHeader } from "@/components/PaymentHeader";

const failSearchSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  orderId: z.string().optional(),
  plan: z.literal("plus").catch("plus"),
});

export const Route = createFileRoute("/payment/fail")({
  validateSearch: failSearchSchema,
  head: () => ({ meta: [{ title: "결제 실패 — Familit" }] }),
  component: PaymentFailPage,
});

function PaymentFailPage() {
  const { code, message, orderId } = Route.useSearch();
  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <PaymentHeader />
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center px-5 py-10">
        <div className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-[var(--shadow-card)] sm:p-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-9 w-9" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold">결제를 완료하지 못했어요</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground break-keep">
            {message || "결제가 취소되었거나 처리 중 문제가 발생했습니다."}
          </p>
          {(code || orderId) && (
            <div className="mt-6 rounded-2xl bg-muted/65 p-4 text-left text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground">오류 코드</strong> {code || "-"}
              </p>
              <p className="mt-2 break-all">
                <strong className="text-foreground">주문번호</strong> {orderId || "-"}
              </p>
            </div>
          )}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              to="/checkout"
              search={{ plan: "plus" }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              다시 결제하기
            </Link>
            <Link
              to="/pricing"
              className="rounded-full border border-border px-5 py-3 text-sm font-bold"
            >
              요금제 보기
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            테스트 결제에서는 실제 금액이 청구되지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
