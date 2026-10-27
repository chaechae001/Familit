import { z } from "zod";

export const confirmPaymentSchema = z.object({
  paymentKey: z.string().min(1).max(200),
  orderId: z
    .string()
    .max(64)
    .regex(/^familit-plus-[a-zA-Z0-9_-]+$/),
  amount: z.number().int().positive(),
  planId: z.literal("plus"),
});

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
