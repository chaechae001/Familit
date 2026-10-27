import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { PaymentHeader } from "@/components/PaymentHeader";
import { formatWon, plans } from "@/lib/plans";

const searchSchema = z.object({ plan: z.literal("plus").catch("plus") });

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "결제 — Familit Plus" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const [widgets, setWidgets] = useState<Awaited<
    ReturnType<Awaited<ReturnType<typeof loadTossPayments>>["widgets"]>
  > | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const rendered = useRef(false);
  const plan = plans.plus;

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    async function renderWidgets() {
      try {
        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
        if (!clientKey) throw new Error("VITE_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.");
        const tossPayments = await loadTossPayments(clientKey);
        const instance = tossPayments.widgets({ customerKey: ANONYMOUS });
        await instance.setAmount({ currency: "KRW", value: plan.price });
        await Promise.all([
          instance.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          instance.renderAgreement({ selector: "#agreement" }),
        ]);
        setWidgets(instance);
        setReady(true);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "결제 위젯을 불러오지 못했습니다.");
      }
    }
    void renderWidgets();
  }, [plan.price]);

  async function requestPayment() {
    if (!widgets || !ready) return;
    setError("");
    const orderId = `familit-plus-${crypto.randomUUID()}`.slice(0, 64);
    try {
      await widgets.requestPayment({
        orderId,
        orderName: "Familit Plus 1개월 이용권",
        successUrl: `${window.location.origin}/payment/success?plan=plus`,
        failUrl: `${window.location.origin}/payment/fail?plan=plus`,
        customerName: "Familit 테스트 고객",
        customerEmail: "test@familit.kr",
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "결제 요청을 시작하지 못했습니다.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--surface)]">
      <PaymentHeader />
      <div className="mx-auto grid w-full max-w-6xl gap-7 px-5 py-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-14">
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <p className="text-xs font-bold text-primary">TEST PAYMENT</p>
            <h1 className="mt-1 font-display text-2xl font-bold">결제 방법을 선택해 주세요</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              토스페이먼츠 테스트 환경으로 실제 금액은 청구되지 않습니다.
            </p>
          </div>
          <div id="payment-method" className="min-h-52" />
          <div id="agreement" />
          {error && (
            <p
              role="alert"
              className="mx-6 mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive sm:mx-8"
            >
              {error}
            </p>
          )}
          <div className="px-6 pb-7 sm:px-8">
            <button
              onClick={requestPayment}
              disabled={!ready}
              className="h-13 w-full rounded-2xl bg-primary px-5 font-bold text-primary-foreground shadow-[var(--shadow-cta)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ready ? `${formatWon(plan.price)} 테스트 결제하기` : "결제창 준비 중…"}
            </button>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] lg:sticky lg:top-6">
          <h2 className="font-display text-lg font-bold">주문 요약</h2>
          <div className="mt-5 rounded-2xl bg-primary-soft/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <strong>{plan.name}</strong>
                <p className="mt-1 text-xs text-muted-foreground">{plan.billingNote}</p>
              </div>
              <strong>{formatWon(plan.price)}</strong>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            {plan.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="my-5 border-t border-border" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">총 결제금액</span>
            <span className="font-display text-xl font-bold">{formatWon(plan.price)}</span>
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            토스페이먼츠의 안전한 결제창을 사용합니다.
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <LockKeyhole className="h-3.5 w-3.5" />
            시크릿 키는 서버에서만 사용됩니다.
          </p>
          <Link
            to="/pricing"
            className="mt-5 block text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            ← 요금제로 돌아가기
          </Link>
        </aside>
      </div>
    </main>
  );
}
