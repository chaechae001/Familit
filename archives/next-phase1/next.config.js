/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  // 개발 모드에서는 PWA 캐싱을 끄는 게 디버깅에 편합니다.
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
