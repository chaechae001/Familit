import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { plans } from "./plans";

const confirmPaymentSchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(6).max(64),
  amount: z.number().int().positive(),
  planId: z.literal("plus"),
});

type TossPayment = {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  totalAmount: number;
  method?: string;
  approvedAt?: string;
};

type TossError = { code?: string; message?: string };

export const confirmTossPayment = createServerFn({ method: "POST" })
  .validator(confirmPaymentSchema)
  .handler(async ({ data }) => {
    const expectedAmount = plans[data.planId].price;
    if (data.amount !== expectedAmount) {
      throw new Error("결제 금액이 선택한 요금제와 일치하지 않습니다.");
    }

    if (!data.orderId.startsWith("familit-plus-")) {
      throw new Error("유효하지 않은 주문번호입니다.");
    }

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      throw new Error("TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.");
    }

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${secretKey}:`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        amount: data.amount,
      }),
    });

    const payload = (await response.json()) as TossPayment | TossError;
    if (!response.ok) {
      const error = payload as TossError;
      throw new Error(error.message || "결제 승인에 실패했습니다.");
    }

    const payment = payload as TossPayment;
    if (payment.orderId !== data.orderId || payment.totalAmount !== expectedAmount) {
      throw new Error("승인된 결제 정보가 주문 정보와 일치하지 않습니다.");
    }

    return {
      paymentKey: payment.paymentKey,
      orderId: payment.orderId,
      orderName: payment.orderName,
      status: payment.status,
      totalAmount: payment.totalAmount,
      method: payment.method ?? "일반결제",
      approvedAt: payment.approvedAt ?? new Date().toISOString(),
    };
  });
