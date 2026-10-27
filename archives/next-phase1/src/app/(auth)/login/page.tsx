import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-ivory flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-forest">패밀릿</h1>
          <p className="mt-2 text-ink-muted">
            가족을 챙기는 마음이 실행으로 이어지도록
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
