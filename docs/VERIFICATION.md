# Familit 검증 기록

기준일: 2026-10-27 (KST). Node 24.19.0 / Windows, npm 잠금 파일로 설치.

| 확인 | 결과 | 근거 |
|---|---|---|
| `npm ci` | 통과 | 479 packages 설치; 잠금 파일 기준 |
| `npm run typecheck` | 통과 | 빌드로 routeTree를 재생성한 후 오류 0 |
| `npm run lint` | 통과 | 오류 0, 기존 shadcn Fast Refresh 경고 6개 |
| `npm run build` | 통과 | 기본 Cloudflare preset 빌드 성공 |
| `NITRO_PRESET=node-server` 빌드 | 통과 | 동일 소스 Node 프로덕션 출력 생성 |
| 프로덕션 요금제→checkout | 통과 | HTTP 200, Plus 링크 이동, 키 누락 alert·버튼 비활성화, 해당 흐름의 console error 0 |
| 승인 정보 없는 success 진입 | 통과 | 필수 승인 정보가 없다는 안내 표시 |
| 비밀정보·대용량 후보 검사 | 통과 | 지정 토큰/개인키 패턴 미검출; `.env`와 생성물 제외 |

## 설치·미리보기 수정

처음에는 넓은 의존성 범위가 최신 TanStack Start와 Vite 7의 충돌을 만들었습니다. 로컬 설치 버전과 잠금 파일을 기준으로 직접 의존성을 고정하고 npm 잠금 파일을 채택했습니다. 기존 Bun 잠금 파일은 제거했습니다.

기존 `vite preview`는 `dist/server/server.js`를 찾다 실패했고, Nitro Cloudflare preview는 Windows에서 `spawn npx ENOENT`로 실패했습니다. `npm run preview -- --port 8080`는 `scripts/preview.mjs`에서 로컬 Node preset으로 빌드 후 실행합니다. 이 스크립트의 기반 명령(동일 Node 빌드와 서버 실행)은 실제 검증했습니다. 기본 배포 preset은 변경하지 않았습니다.

개발 모드에서는 Lovable 소스 태그(`data-tsd-source`)의 SSR/클라이언트 차이로 hydration 경고가 관찰됐습니다. Node 프로덕션 미리보기의 요금제→checkout 흐름에서는 재현되지 않았습니다.

## 미검증

- Toss 실제 테스트 승인·취소·환불, Supabase 원격 데이터·Auth·RLS, 상용 배포.
- 테스트 키 없이 외부 결제 API를 호출하지 않았습니다. 키 누락 안내가 동작한다는 사실을 결제 성공으로 표현하지 않습니다.
- `archives/` 초기 Next.js 버전은 보존용이며 별도 설치·실행하지 않았습니다.
- 번들 크기 경고와 기존 UI Fast Refresh 경고는 후속 정리 항목입니다.
