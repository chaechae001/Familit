import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

// 값 자체를 출력하지 않고, 공개 예정 파일의 위치와 위험 종류만 알립니다.
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  {
    encoding: "utf8",
  },
)
  .split("\0")
  .filter(Boolean);
const patterns = [
  ["개인 키", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  [
    "비밀 토큰",
    /(?:sk_live_|sk_test_|test_gsk_|live_gsk_|test_sk_|live_sk_|ghp_|github_pat_|sk-proj-|sb_secret_)[A-Za-z0-9_-]{20,}/g,
  ],
  ["AWS 접근 키", /AKIA[A-Z0-9]{16}/],
];
const findings = [];
for (const file of new Set(files)) {
  if (!existsSync(file)) continue;
  if (/(^|\/)\.env(?:\.|$)/.test(file) && !file.endsWith(".env.example")) {
    findings.push([file, "실제 환경설정 파일"]);
  }
  if (/\.(?:pem|key|p12|pfx)$/.test(file)) findings.push([file, "인증서 또는 키 파일"]);
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const source = buffer.toString("utf8");
  for (const [kind, pattern] of patterns) {
    const matches = source.match(new RegExp(pattern.source, "g")) ?? [];
    if (matches.some((value) => !/your_|example|placeholder/.test(value))) {
      findings.push([file, kind]);
    }
  }
  for (const token of source.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? []) {
    try {
      const claims = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
      if (claims.role === "service_role") findings.push([file, "Supabase 서비스 권한 키"]);
    } catch {
      // JWT가 아닌 문자열은 다른 토큰 패턴으로 검사합니다.
    }
  }
}
if (findings.length) {
  for (const [file, kind] of findings) console.error(`${file}: ${kind}`);
  process.exitCode = 1;
} else {
  console.log(`비밀정보 패턴 검사 통과 (${new Set(files).size}개 파일, 실제 값 출력 없음)`);
}
