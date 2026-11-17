import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Database, UserCheck, Mail, FileText } from "lucide-react";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "신뢰와 보안 — Familit" },
      {
        name: "description",
        content:
          "Familit이 가족 정보를 어떻게 보호하는지, 어떤 데이터를 수집하고 어떻게 사용하는지 안내합니다.",
      },
      { property: "og:title", content: "Familit 신뢰와 보안" },
      {
        property: "og:description",
        content: "데이터 보호 정책, 접근 통제, 개인정보 처리 방식에 대한 안내",
      },
    ],
  }),
  component: TrustPage,
});

function TrustPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Familit
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← 홈으로
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          신뢰와 보안
        </div>
        <h1
          className="mt-4 font-display font-bold tracking-tight break-keep"
          style={{ fontSize: "clamp(26px, 5vw, 40px)" }}
        >
          가족 정보는 신중하게 다룹니다.
        </h1>
        <p className="mt-4 text-muted-foreground break-keep leading-relaxed">
          현재 공개 화면은 시연용 프로토타입입니다. 아래 내용은 구현 상태와 향후 데이터 보호 원칙을
          설명하며, 운영 보안 인증이나 원격 데이터베이스 검증을 의미하지 않습니다.
        </p>

        <div className="mt-10 space-y-5">
          <TrustCard
            Icon={Lock}
            title="접근 통제 (Row Level Security)"
            body={
              <>
                현재 데모는 예시 가족과 케어 카드를 사용하며 실제 가족 데이터를 조회하거나 저장하지
                않습니다. 실제 저장 기능을 연결할 때는 가족 그룹 소유자만 데이터에 접근하도록
                데이터베이스의 행 수준 보안(RLS)과 권한을 검증할 계획입니다.
              </>
            }
          />

          <TrustCard
            Icon={UserCheck}
            title="인증과 세션"
            body={
              <>
                Supabase 인증 연동을 위한 기반 코드는 구성되어 있습니다. 현재 데모에는 실제
                로그인·가입 화면이 연결되어 있지 않으며, 인증 성공과 사용자별 데이터 접근은 별도
                검증이 필요한 영역입니다.
              </>
            }
          />

          <TrustCard
            Icon={Database}
            title="수집하는 정보"
            body={
              <>
                베타 신청과 가족 케어 화면의 입력 내용은 현재 저장하거나 전송하지 않습니다. 실제
                개인정보를 입력하지 마세요. 건강 관련 예시는 생활 관리 참고 수준이며 의료 진단이나
                치료를 대체하지 않습니다. 진단서·처방전·검사결과 파일 업로드는 제공하지 않습니다.
              </>
            }
          />

          <TrustCard
            Icon={FileText}
            title="데이터 사용과 보관"
            body={
              <>
                현재 데모의 케어 카드 변경은 화면 상태로만 관리되며 새로고침하면 초기화됩니다. 실제
                저장 기능을 출시하기 전에 수집 목적·동의·보관 기간·삭제 기능을 마련하고 안내할
                계획입니다. 가족 간 공유와 초대는 실제 서비스로 연결되어 있지 않습니다.
              </>
            }
          />

          <TrustCard
            Icon={Shield}
            title="인프라"
            body={
              <>
                결제 시크릿 키는 서버에서만 사용하고 브라우저에는 전달하지 않습니다. 현재 결제는
                테스트용 키만 허용하며 실결제와 이용권 발급은 지원하지 않습니다. 테스트 결제를
                진행하면 토스페이먼츠의 테스트 결제 화면을 사용합니다.
              </>
            }
          />

          <TrustCard
            Icon={Mail}
            title="문의 및 보안 신고"
            body={
              <>
                공개된 GitHub 프로젝트에서 개선 의견을 남길 수 있습니다. 공개 이슈에는 개인정보, API
                키, 결제 키나 취약점 악용에 필요한 내용을 첨부하지 마세요.
              </>
            }
          />
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground break-keep leading-relaxed">
          본 문서는 Familit 팀이 유지·관리하는 안내문으로, 법적 약관 또는 공식 개인정보처리방침을
          대체하지 않습니다. 정식 약관과 처리방침은 서비스 출시 시 별도로 게시될 예정입니다.
        </div>
      </section>
    </main>
  );
}

function TrustCard({
  Icon,
  title,
  body,
}: {
  Icon: typeof Shield;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-lg font-bold tracking-tight break-keep">{title}</h2>
      </div>
      <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground break-keep">{body}</p>
    </div>
  );
}
