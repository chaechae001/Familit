# Familit 인수인계

## 시작 위치

- 로컬 기준: `E:\Project\Familit\repository`.
- 원격: https://github.com/chaechae001/Familit
- 이번 브랜치: `chore/portfolio-handoff-20261027`; 기존 `main`의 이력을 보존합니다.
- 루트는 TanStack 앱입니다. 부모 폴더의 Next.js용 AGENTS/스펙을 현재 프레임워크 규칙으로 오해하지 않도록 이 저장소의 AGENTS를 우선합니다.

## 버전 선택 이유

GitHub 앱은 이미 TanStack이며 로컬의 결제 확장이 같은 기반입니다. 따라서 원격 앱에 결제 변경을 통합했습니다. 원격에만 있던 인증·UI 컴포넌트·서버 오류 래퍼는 삭제하지 않았습니다. `familit`, `familit_2`는 별도 초기 실험으로 보존합니다.

## 재개 절차

1. README의 `npm ci`와 `.env.example` 설정을 진행합니다. 현재 앱의 키 이름은 `VITE_`/서버용이며 Next.js의 `NEXT_PUBLIC_`와 다릅니다.
2. `/demo`에서 케어 카드 흐름, `/pricing`에서 요금제를 검토합니다.
3. [VERIFICATION.md](VERIFICATION.md)의 실제 통과·미검증 항목을 확인합니다.
4. 다음 기능은 실제 가족 그룹 생성·케어 카드 저장 한 흐름으로 제한합니다. 데모 데이터를 실데이터와 구분합니다.

## 수정 시 주의

- `src/routes/` 라우트가 원본이며 `routeTree.gen.ts`는 생성 파일입니다.
- `src/start.ts`, `src/server.ts`, `src/integrations/supabase/`의 기존 인증·오류 경로를 유지합니다.
- Toss 시크릿은 서버의 `TOSS_SECRET_KEY`로만 접근합니다. 상용 승인 테스트를 실행하지 않습니다.
- DB와 배포는 이번 정리에서 변경하지 않았습니다. 운영 기능이 완료되었다고 표시하지 않습니다.
