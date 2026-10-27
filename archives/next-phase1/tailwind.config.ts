import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 패밀릿 브랜드 팔레트
        ivory: {
          DEFAULT: "#FAF6EC", // 기본 배경
          deep: "#F2EBDA",    // 카드 구분용 살짝 진한 아이보리
        },
        forest: {
          DEFAULT: "#15543E", // 진한 그린 (primary, 신뢰감)
          600: "#1E7355",
          700: "#114433",
        },
        mint: {
          DEFAULT: "#8FE0C9", // 민트 (accent)
          soft: "#DBF3EA",    // 연한 민트 (배경 강조/뱃지)
        },
        ink: {
          DEFAULT: "#1C2A24", // 본문 텍스트
          muted: "#5C6B63",   // 보조 텍스트
        },
        // 우선순위/상태 색
        urgent: "#D9544D",
        warn: "#E0A23B",
      },
      fontFamily: {
        // 부모 세대 가독성을 위해 Pretendard를 기본으로 사용
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
      fontSize: {
        // 부모 세대 가독성 기준: 기본 본문을 크게
        base: ["1.0625rem", { lineHeight: "1.6" }], // 17px
        lg: ["1.1875rem", { lineHeight: "1.55" }],  // 19px
        xl: ["1.375rem", { lineHeight: "1.45" }],   // 22px
        "2xl": ["1.75rem", { lineHeight: "1.3" }],  // 28px
        "3xl": ["2.125rem", { lineHeight: "1.2" }], // 34px
      },
      borderRadius: {
        card: "1.25rem", // 카드형 UI 기본 라운드
      },
      boxShadow: {
        card: "0 2px 12px rgba(21, 84, 62, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
