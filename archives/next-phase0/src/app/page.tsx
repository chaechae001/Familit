import { redirect } from "next/navigation";

// 진입점: 미들웨어가 인증 상태에 따라 /home 또는 /login 으로 보냅니다.
export default function RootPage() {
  redirect("/home");
}
