import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

// ⚠️ TEMP: Phase 2 화면 목업을 미로그인 상태로 미리보기 위한 임시 우회입니다.
// Supabase 프로젝트 연동 및 로그인 흐름 테스트 시 반드시 false로 되돌리세요.
const SKIP_AUTH_GUARD_FOR_MOCKUP = true;

// 매 요청마다 Supabase 세션을 갱신하고, 보호 라우트 접근을 제어합니다.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isOnboarding = pathname.startsWith("/onboarding");
  const isPublic = isAuthPage || pathname === "/";

  if (SKIP_AUTH_GUARD_FOR_MOCKUP) {
    return response;
  }

  // 미로그인 사용자가 보호 라우트에 접근하면 로그인으로 이동
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 로그인한 사용자의 가족 그룹 존재 여부에 따라 온보딩/메인 화면을 분기
  if (user && (isAuthPage || isOnboarding || !isPublic)) {
    const { data: group } = await supabase
      .from("family_groups")
      .select("id")
      .limit(1)
      .maybeSingle();

    const url = request.nextUrl.clone();

    // 온보딩을 마친 사용자가 로그인/회원가입/온보딩 화면에 다시 들어오면 홈으로
    if (group && (isAuthPage || isOnboarding)) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    // 온보딩을 마치지 않은 사용자가 메인 화면에 접근하면 온보딩으로
    if (!group && !isAuthPage && !isOnboarding) {
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
