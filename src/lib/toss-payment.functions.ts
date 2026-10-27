import { createServerFn } from "@tanstack/react-start";
import { confirmPaymentSchema } from "./payments/schema";

export const confirmTossPayment = createServerFn({ method: "POST" })
  .validator(confirmPaymentSchema)
  .handler(async ({ data }) => {
    const { confirmTestPayment } = await import("./payments/confirm.server");
    return confirmTestPayment(data, process.env.TOSS_SECRET_KEY);
  });
