import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요.").max(50, "이름이 너무 길어요."),
    email: z.string().min(1, "이메일을 입력해주세요.").email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(6, "비밀번호는 6자 이상이어야 해요."),
    passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordConfirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
