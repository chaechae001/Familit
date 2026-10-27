# Familit 토스페이먼츠 테스트 결제

## 구현 화면

- `/pricing` — 무료/Plus 요금제 비교
- `/checkout?plan=plus` — 토스페이먼츠 결제위젯
- `/payment/success` — 결제 승인 API 호출 및 성공 결과
- `/payment/fail` — 결제 실패 정보와 재시도

## 로컬 실행

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`에 토스페이먼츠 개발자센터의 **결제위젯 연동 키** 한 쌍을 입력합니다.

```env
VITE_TOSS_CLIENT_KEY=test_gck_...
TOSS_SECRET_KEY=test_gsk_...
```

클라이언트 키와 시크릿 키는 반드시 같은 상점(MID)의 키를 사용해야 합니다. 시크릿 키는 `TOSS_SECRET_KEY`로만 설정하고, `VITE_` 접두사를 붙이지 않습니다.

## 테스트 순서

1. `http://localhost:8080/pricing`에서 Familit Plus를 선택합니다.
2. 결제위젯에서 결제수단과 약관을 선택합니다.
3. `4,900원 테스트 결제하기`를 누릅니다.
4. 토스 테스트 결제를 완료합니다.
5. 성공 페이지에서 서버가 승인 API를 호출한 결과를 확인합니다.
6. 토스페이먼츠 개발자센터의 테스트 결제내역에서도 승인 건을 확인합니다.

## 배포 환경변수

- Lovable/TanStack 서버: `VITE_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`
- Supabase Edge Function을 사용할 경우: `supabase secrets set TOSS_SECRET_KEY=...`

`supabase/functions/toss-confirm/index.ts`는 Lovable Cloud에서 승인 처리를 Edge Function으로 옮길 때 사용할 수 있는 동일 검증 버전입니다. 현재 웹 앱은 TanStack 서버 함수가 승인 API를 호출합니다.

## 출시 전 필수 보강

- 주문 생성 시 서버 DB에 `orderId`, 플랜, 금액, 사용자 ID를 먼저 저장
- 승인 전에 DB 주문 원본과 리다이렉트 파라미터를 대조
- 승인 성공 후 결제/이용권 상태를 트랜잭션으로 저장
- 중복 승인 방지(idempotency), 웹훅 검증, 취소·환불 처리
- 개인정보처리방침·이용약관·환불정책 게시
