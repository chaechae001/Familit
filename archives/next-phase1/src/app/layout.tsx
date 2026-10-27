import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "패밀릿 - 가족 케어",
  description:
    "가족을 챙기는 마음이 실행으로 이어지도록, AI가 가족 케어 루틴을 관리해주는 앱",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "패밀릿",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#15543E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
