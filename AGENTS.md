# Familit 작업 안내

- 현재 앱: 루트의 TanStack Start + React + Vite + Tailwind 4. `archives/`는 이전 Next.js 구현이며 수정하지 않습니다.
- 제품은 가족 케어 앱입니다. 홈의 핵심은 케어 액션 카드이며 캘린더 중심으로 바꾸지 않습니다.
- 먼저 `docs/HANDOFF.md`, `docs/PROJECT_STATUS.md`, `docs/VERIFICATION.md`를 읽습니다.
- `src/routes` 파일 기반 라우팅을 유지합니다. `src/routeTree.gen.ts`는 라우터가 생성합니다.
- 원격의 인증 미들웨어·SSR 오류 래퍼를 유지합니다. AI·결제 비밀키는 서버에서만 접근합니다.
- 결제는 테스트 시연 단계입니다. 서버 주문 원장·중복 승인 방지·환불 구현 전 상용 결제로 표시하지 않습니다.
- 건강 관련 내용은 생활 관리 참고 수준으로 한정합니다. 민감 건강 파일 업로드를 추가하지 않습니다.
- 변경 후 lint/typecheck/build를 실행하고 결과와 남은 이슈를 기록합니다. 비밀키·실제 개인정보를 커밋하지 않습니다.
