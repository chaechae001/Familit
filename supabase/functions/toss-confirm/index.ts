const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { paymentKey, orderId, amount, planId } = await request.json();
    if (planId !== "plus" || amount !== 4900 || !String(orderId).startsWith("familit-plus-")) {
      return Response.json(
        { code: "INVALID_ORDER", message: "주문 정보가 올바르지 않습니다." },
        { status: 400, headers: corsHeaders },
      );
    }
    const secretKey = Deno.env.get("TOSS_SECRET_KEY");
    if (!secretKey) throw new Error("TOSS_SECRET_KEY가 설정되지 않았습니다.");
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${secretKey}:`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return Response.json(
      { code: "CONFIRM_ERROR", message: error instanceof Error ? error.message : "결제 승인 오류" },
      { status: 500, headers: corsHeaders },
    );
  }
});
