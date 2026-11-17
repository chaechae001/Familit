import { z } from "zod";
import { plans } from "../plans.ts";
import { confirmPaymentSchema, type ConfirmPaymentInput } from "./schema.ts";

const paymentResponseSchema = z.object({
  orderId: z.string(),
  orderName: z.string(),
  status: z.literal("DONE"),
  totalAmount: z.number().int().positive(),
  method: z.string().optional(),
  approvedAt: z.string().optional(),
});

// 주문 원장과 이용권 발급이 없는 프로토타입에서는 테스트 승인만 허용합니다.
export async function confirmTestPayment(
  input: ConfirmPaymentInput,
  secretKey: string | undefined,
  fetchPayment: typeof fetch = fetch,
) {
  const data = confirmPaymentSchema.parse(input);
  const expectedAmount = plans[data.planId].price;
  if (data.amount !== expectedAmount) {
    throw new Error("결제 금액이 선택한 요금제와 일치하지 않습니다.");
  }
  if (!secretKey || !/^test_gsk_[A-Za-z0-9_-]+$/.test(secretKey)) {
    throw new Error("테스트 결제용 시크릿 키를 설정해 주세요. 실결제는 지원하지 않습니다.");
  }

  const response = await fetchPayment("https://api.tosspayments.com/v1/payments/confirm", {
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
    signal: AbortSignal.timeout(10_000),
  }).catch(() => {
    throw new Error("결제 서비스에 연결하지 못했습니다. 잠시 후 다시 확인해 주세요.");
  });

  // 외부 오류 본문에는 결제 정보가 포함될 수 있으므로 그대로 전달하지 않습니다.
  if (!response.ok) {
    throw new Error("테스트 결제 승인에 실패했습니다. 결제 정보를 확인해 주세요.");
  }
  const payload: unknown = await response.json().catch(() => null);
  const result = paymentResponseSchema.safeParse(payload);
  if (
    !result.success ||
    result.data.orderId !== data.orderId ||
    result.data.totalAmount !== expectedAmount
  ) {
    throw new Error("승인된 결제 정보가 주문 정보와 일치하지 않습니다.");
  }

  return {
    ...result.data,
    method: result.data.method ?? "일반결제",
  };
}
