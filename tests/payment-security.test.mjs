import assert from "node:assert/strict";
import test from "node:test";
import { confirmTestPayment } from "../src/lib/payments/confirm.server.ts";

const input = {
  paymentKey: "payment-fixture",
  orderId: "familit-plus-order-fixture",
  amount: 4900,
  planId: "plus",
};
const testSecret = `test_gsk_${"x".repeat(24)}`;
const validResponse = {
  orderId: input.orderId,
  orderName: "Familit Plus 테스트",
  totalAmount: 4900,
  status: "DONE",
  paymentKey: "서버 응답에서 제거할 정보",
};

test("실결제 키와 누락된 키는 외부 요청 전에 차단한다", async () => {
  for (const key of [undefined, `live_gsk_${"x".repeat(24)}`, "invalid"]) {
    await assert.rejects(
      confirmTestPayment(input, key, () => assert.fail("외부 결제를 호출하면 안 됩니다")),
      /실결제는 지원하지 않습니다/,
    );
  }
});

test("변조된 금액·주문·플랜은 외부 요청 전에 차단한다", async () => {
  for (const data of [
    { ...input, amount: 1 },
    { ...input, amount: -4900 },
    { ...input, orderId: "other-order" },
    { ...input, planId: "free" },
    { ...input, paymentKey: "" },
  ]) {
    await assert.rejects(
      confirmTestPayment(data, testSecret, () => assert.fail("외부 결제를 호출하면 안 됩니다")),
    );
  }
});

test("정상 테스트 응답은 승인하되 결제 키를 클라이언트에 반환하지 않는다", async () => {
  let requests = 0;
  const result = await confirmTestPayment(input, testSecret, async (url, options) => {
    requests++;
    assert.equal(url, "https://api.tosspayments.com/v1/payments/confirm");
    assert.equal(options.method, "POST");
    assert.deepEqual(JSON.parse(options.body), {
      paymentKey: input.paymentKey,
      orderId: input.orderId,
      amount: input.amount,
    });
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json(validResponse);
  });
  assert.equal(requests, 1);
  assert.equal(result.status, "DONE");
  assert.equal(result.totalAmount, 4900);
  assert.equal(result.paymentKey, undefined);
});

test("다른 주문·금액·미승인 상태·깨진 응답은 성공으로 표시하지 않는다", async () => {
  for (const payload of [
    { ...validResponse, orderId: "familit-plus-another" },
    { ...validResponse, totalAmount: 1 },
    { ...validResponse, status: "READY" },
    {},
  ]) {
    await assert.rejects(
      confirmTestPayment(input, testSecret, async () => Response.json(payload)),
      /주문 정보와 일치하지 않습니다/,
    );
  }
  await assert.rejects(
    confirmTestPayment(input, testSecret, async () => new Response("invalid json")),
    /주문 정보와 일치하지 않습니다/,
  );
});

test("외부 오류 본문과 연결 오류의 민감한 정보를 사용자에게 전달하지 않는다", async () => {
  await assert.rejects(
    confirmTestPayment(input, testSecret, async () =>
      Response.json({ message: "민감한 결제 정보" }, { status: 400 }),
    ),
    (error) => !error.message.includes("민감한") && /승인에 실패/.test(error.message),
  );
  await assert.rejects(
    confirmTestPayment(input, testSecret, async () => {
      throw new Error("민감한 연결 정보");
    }),
    (error) => !error.message.includes("민감한") && /연결하지 못했습니다/.test(error.message),
  );
});
