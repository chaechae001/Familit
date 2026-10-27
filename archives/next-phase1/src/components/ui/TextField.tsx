import type { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  errors?: string[];
};

// 공용 입력 필드 — 라벨 + 큰 터치 타깃 + 에러 메시지
export function TextField({ label, errors, id, ...inputProps }: TextFieldProps) {
  const inputId = id ?? inputProps.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full rounded-card border border-ivory-deep bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-forest"
        {...inputProps}
      />
      {errors?.map((message) => (
        <p key={message} className="text-sm text-urgent">
          {message}
        </p>
      ))}
    </div>
  );
}
