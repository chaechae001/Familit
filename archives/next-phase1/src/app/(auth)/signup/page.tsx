import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-dvh bg-ivory flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-forest">패밀릿</h1>
          <p className="mt-2 text-ink-muted">
            가족 케어를 함께 시작해보세요
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
