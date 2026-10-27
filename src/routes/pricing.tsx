import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, HeartHandshake, Sparkles } from "lucide-react";
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { plans } from "@/lib/plans";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "요금제 — Familit" },
      { name: "description", content: "Familit 무료 및 Plus 요금제를 비교해보세요." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <PaymentHeader />
      <section className="mx-auto w-full max-w-5xl px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
            <HeartHandshake className="h-3.5 w-3.5" /> 가족에게 맞는 시작
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight break-keep sm:text-5xl">
            기록에서 끝나지 않고,
            <br />
            가족의 행동까지 이어지도록
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground break-keep">
            기본 가족 일정과 역할 공유는 무료로 시작하고, AI 추천과 무제한 기록이 필요할 때 Plus를
            이용하세요.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <PlanCard plan={plans.free} />
          <PlanCard plan={plans.plus} />
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-accent/25 bg-accent-soft/45 p-5 text-sm leading-relaxed text-muted-foreground break-keep">
          <strong className="text-foreground">
            현재는 요금제와 테스트 결제를 보여주는 데모예요.
          </strong>{" "}
          표시된 기능은 서비스 설계안이며 실제 이용권은 발급되지 않습니다. 테스트 결제에는 실제
          요금이 청구되지 않습니다.
        </div>
      </section>
    </main>
  );
}

function PlanCard({ plan }: { plan: (typeof plans)[keyof typeof plans] }) {
  const paid = plan.id === "plus";
  return (
    <article
      className={`relative flex flex-col rounded-3xl border bg-card p-7 shadow-[var(--shadow-card)] ${plan.recommended ? "border-primary ring-2 ring-primary/10" : "border-border"}`}
    >
      {plan.recommended && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          <Sparkles className="h-3 w-3" /> 추천
        </span>
      )}
      <h2 className="font-display text-xl font-bold">{plan.name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground break-keep">
        {plan.description}
      </p>
      <div className="mt-6">
        <span className="font-display text-3xl font-bold">{plan.priceLabel}</span>
        {paid && <span className="ml-1 text-sm text-muted-foreground">/ 1개월</span>}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{plan.billingNote}</p>
      <ul className="mt-7 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm leading-relaxed break-keep">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Check className="h-3.5 w-3.5" />
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        to={paid ? "/checkout" : "/demo"}
        search={paid ? { plan: "plus" } : undefined}
        className={`mt-8 inline-flex h-12 items-center justify-center rounded-full text-sm font-bold transition-all active:scale-[0.98] ${paid ? "bg-primary text-primary-foreground shadow-[var(--shadow-cta)] hover:opacity-95" : "border border-border bg-background text-foreground hover:border-primary/40"}`}
      >
        {paid ? "Plus 테스트 결제하기" : "무료로 체험하기"}
      </Link>
    </article>
  );
}
