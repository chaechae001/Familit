import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, LoaderCircle, ReceiptText } from "lucide-react";
import { z } from "zod";
import { PaymentHeader } from "@/components/PaymentHeader";
import { confirmTossPayment } from "@/lib/toss-payment.functions";
import { formatWon } from "@/lib/plans";

const successSearchSchema = z.object({
  paymentKey: z.string().optional(),
  orderId: z.string().optional(),
  amount: z.coerce.number().optional(),
  plan: z.literal("plus").catch("plus"),
});

type PaymentResult = Awaited<ReturnType<typeof confirmTossPayment>>;

export const Route = createFileRoute("/payment/success")({
  validateSearch: successSearchSchema,
  head: () => ({ meta: [{ title: "결제 완료 — Familit" }] }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const search = Route.useSearch();
  const started = useRef(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!search.paymentKey || !search.orderId || !search.amount) {
      setError("결제 승인에 필요한 정보가 없습니다.");
      return;
    }
    confirmTossPayment({
      data: {
        paymentKey: search.paymentKey,
        orderId: search.orderId,
        amount: search.amount,
        planId: "plus",
      },
    })
      .then(setResult)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "결제 승인에 실패했습니다."),
      );
  }, [search]);

  if (error) {
    return (
      <ResultLayout>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive">
          <ReceiptText className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">결제 승인 중 문제가 생겼어요</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground break-keep">{error}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            to="/checkout"
            search={{ plan: "plus" }}
            className="rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground"
          >
            다시 결제하기
          </Link>
          <Link
            to="/pricing"
            className="rounded-full border border-border px-5 py-3 text-center text-sm font-bold"
          >
            요금제 보기
          </Link>
        </div>
      </ResultLayout>
    );
  }

  if (!result) {
    return (
      <ResultLayout>
        <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-5 font-display text-2xl font-bold">결제를 승인하고 있어요</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          창을 닫거나 새로고침하지 말고 잠시만 기다려 주세요.
        </p>
      </ResultLayout>
    );
  }

  return (
    <ResultLayout>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <p className="mt-5 text-xs font-bold tracking-wide text-primary">PAYMENT COMPLETE</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Familit Plus 결제가 완료됐어요</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground break-keep">
        이제 한 달 동안 AI 준비목록과 무제한 가족 액션 카드를 테스트할 수 있어요.
      </p>
      <dl className="mt-7 space-y-3 rounded-2xl bg-muted/65 p-5 text-sm">
        <Row label="상품" value={result.orderName} />
        <Row label="결제 금액" value={formatWon(result.totalAmount)} />
        <Row label="결제 수단" value={result.method} />
        <Row label="주문번호" value={result.orderId} mono />
      </dl>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5" />
        자동 갱신되지 않는 1개월 이용권입니다.
      </p>
      <Link
        to="/demo"
        className="mt-7 inline-flex w-full justify-center rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-cta)]"
      >
        Familit 시작하기
      </Link>
    </ResultLayout>
  );
}

function ResultLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <PaymentHeader />
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-xl items-center px-5 py-10">
        <div className="w-full rounded-3xl border border-border bg-card p-7 text-center shadow-[var(--shadow-card)] sm:p-10">
          {children}
        </div>
      </section>
    </main>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={`text-right font-semibold break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
