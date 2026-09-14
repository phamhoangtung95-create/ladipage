export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const { order_code, customer_name, phone, email, zalo, product_name, amount, status, created_at } = body;

  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbw8tJe-h4inUDXiPWgdNQqd7P1MhvMnWFQZ4A_1_1cYzL9NwZennY2IoVcU39KXeVuyXg/exec";
  
  // 1. Gửi dữ liệu về Google Sheets Webhook
  if (GOOGLE_SHEET_URL) {
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_order",
          order_code: order_code || "",
          customer_name: customer_name || "",
          phone: phone || "",
          email: email || "",
          zalo: zalo || "",
          product_name: product_name || "",
          amount: amount || 0,
          status: status || "Chờ thanh toán (pending)",
          created_at: created_at || new Date().toLocaleString("vi-VN")
        })
      });
    } catch (sheetErr) {
      console.error("Google Sheet webhook error:", sheetErr);
    }
  }

  // 2. Gửi dữ liệu về Supabase (nếu có cấu hình)
  const SUPABASE_URL = process.env.SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          order_code,
          customer_name,
          phone,
          email,
          zalo,
          product_name,
          amount,
          status: status || "pending"
        })
      });
    } catch (sbErr) {
      console.error("Supabase insert error:", sbErr);
    }
  }

  return res.status(200).json({ success: true, order_code });
}
