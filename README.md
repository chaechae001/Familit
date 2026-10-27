# Familit · 패밀릿

가족을 챙기는 마음을 실행으로 연결하는 가족 케어 서비스 프로토타입입니다. 흩어진 건강검진·생일·생활 업무를 케어 액션 카드와 체크리스트로 보여줍니다.

현재는 **랜딩·클릭형 케어 데모·테스트 결제 구현 단계**입니다. 실사용 가족 데이터 저장, AI 생성, 결제 이용권 발급이 완성된 상용 서비스로 소개하지 않습니다.

## 구현과 설계

| 구분 | 현재 범위 |
|---|---|
| 랜딩 | 서비스 소개, 가족 케어 사례, 베타 CTA |
| 데모 | 케어보드·액션 카드·체크리스트·간편 응답 시뮬레이션 |
| 신뢰 | 데이터·인증·접근 제어 안내 화면 |
| 테스트 결제 | Plus 요금제 → 위젯 → 서버 승인 요청 → 성공/실패 화면 |
| 백엔드 | Supabase 연동 기반 및 기존 마이그레이션; 실제 운영 적용은 별도 확인 필요 |
| 이전 구현 | Next.js 초기 버전 2개를 `archives/`에 보존 |

기술: React 19, TypeScript, TanStack Start/Router/Query, Vite 7, Tailwind CSS 4, Supabase, Toss Payments SDK.

## 실행

Node.js 22 LTS 이상을 권장합니다. 루트 앱은 npm 잠금 파일 기준으로 실행합니다.

```powershell
npm ci
Copy-Item .env.example .env
# 자신의 개발용 Supabase 설정과 Toss 테스트 위젯 키를 .env에 입력
npm run dev -- --host 127.0.0.1 --port 8080
```

`/`, `/demo`, `/trust`, `/pricing`, `/checkout?plan=plus`, `/payment/success`, `/payment/fail`을 확인합니다. 키가 없으면 결제 화면의 설정 오류 안내까지만 확인할 수 있습니다. 실결제 키는 사용하지 않습니다.

```powershell
npm run typecheck
npm run lint
npm run build
```

최신 결과와 한계: [검증 기록](docs/VERIFICATION.md).

## 다음 작업

1. 데모와 실제 저장 기능의 범위를 확정하고 Auth·가족·케어 카드 저장 흐름을 구현합니다.
2. 결제 원장, 중복 승인 방지, 웹훅·취소·환불·이용권 상태를 설계합니다.
3. 사용자 검토와 모바일 접근성을 점검합니다.

실행을 이어가려면 [인수인계](docs/HANDOFF.md), [진행 현황](docs/PROJECT_STATUS.md), [버전 보관 안내](archives/README.md)를 읽습니다. 테스트 결제 상세는 [README_PAYMENT.md](README_PAYMENT.md)에 있습니다.

## Windows 프로덕션 미리보기

```powershell
npm run preview -- --port 8080
```

로컬 Node 서버용으로 빌드하고 실행합니다. 기본 `npm run build`의 Cloudflare 배포 설정은 유지합니다. 첫 빌드에서 파일 기반 라우트 타입이 갱신되므로 새 라우트를 추가한 경우 빌드 후 타입 검사를 수행합니다.
