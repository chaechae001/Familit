# 패밀릿 (Familit) — Phase 0 환경 세팅

가족 케어 앱 MVP의 기반 골격입니다. (Next.js 15 · TypeScript · Tailwind · Supabase · PWA)

## 0. 사전 준비

- Node.js 18.18 이상 (20 LTS 권장)
- Supabase 프로젝트 1개 (supabase.com 에서 무료 생성)

## 1. 의존성 설치

```bash
cd familit
npm install
```

## 2. 데이터베이스 스키마 적용

Supabase 대시보드 → **SQL Editor → New query** 에 `familit_schema.sql`
전체 내용을 붙여넣고 **Run**.
(enum → 9개 테이블 → 인덱스 → 트리거 → RLS 정책까지 한 번에 적용됩니다.)

## 3. 환경변수 설정

`.env.example` 를 복사해 `.env.local` 을 만들고 값을 채웁니다.

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  → Supabase 대시보드 → Project Settings → API
- `ANTHROPIC_API_KEY` 또는 `OPENAI_API_KEY`
  → AI 기능(Phase 3)에서 사용. 지금은 비워둬도 됩니다.

## 4. PWA 아이콘 넣기

`public/icons/` 에 `icon-192.png`, `icon-512.png` 두 장을 넣습니다.
(임시로 아무 정사각형 PNG나 넣어도 부팅에는 문제 없습니다.)

## 5. 실행

```bash
npm run dev
```

→ http://localhost:3000 접속 시 `/home` 으로 이동하고
"Phase 0 세팅 완료 ✓" 카드가 보이면 정상입니다.
(로그인 미연동 상태라 미들웨어가 `/login` 으로 보낼 수 있는데,
Phase 1에서 Supabase Auth를 붙이면 정상 흐름이 됩니다.)

---

## 이 단계에서 만들어진 것

| 구분 | 파일 |
|---|---|
| 설정 | `package.json`, `next.config.js`(PWA), `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js` |
| 브랜드 토큰 | `tailwind.config.ts`(진한그린·민트·아이보리 + 큰 글씨 스케일), `src/app/globals.css` |
| PWA | `public/manifest.json`, `next.config.js` |
| Supabase | `src/lib/supabase/{client,server,middleware}.ts`, `src/middleware.ts` |
| 타입 | `src/types/database.ts` (9개 테이블 타입) |
| 레이아웃 | 루트 레이아웃, `(main)` 하단 탭 네비게이션, 케어보드/로그인 골격 |

## 다음 단계 (Phase 1)

1. Supabase Auth 로그인/회원가입 화면
2. 온보딩 5단계 (이름 → 가족 그룹 → 구성원 → 관심 케어 영역 → AI 추천)
3. 가족 구성원 CRUD
4. 케어 카드 CRUD
