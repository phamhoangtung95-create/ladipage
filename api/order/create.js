if (!global.__PENDING_ORDERS__) {
  global.__PENDING_ORDERS__ = [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const body = req.body || {};
  const { order_code, customer_name, phone, email, zalo, product_name, amount, status, created_at } = body;

  const newOrder = {
    id: Date.now(),
    order_code: order_code || `DH${Math.floor(1000 + Math.random() * 9000)}`,
    customer_name: customer_name || "Khách hàng",
    phone: phone || "",
    email: email || "",
    zalo: zalo || "",
    product_name: product_name || "Sản phẩm",
    product_type: "digital",
    amount: parseFloat(amount || 0),
    status: status || "pending",
    created_at: created_at || new Date().toLocaleString("vi-VN")
  };

  // Lưu vào cache pending orders
  global.__PENDING_ORDERS__.unshift(newOrder);

  // Gửi sang Google Sheets Webhook
  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbw8tJe-h4inUDXiPWgdNQqd7P1MhvMnWFQZ4A_1_1cYzL9NwZennY2IoVcU39KXeVuyXg/exec";
  if (GOOGLE_SHEET_URL) {
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_order",
          order_code: newOrder.order_code,
          customer_name: newOrder.customer_name,
          phone: newOrder.phone,
          email: newOrder.email,
          zalo: newOrder.zalo,
          product_name: newOrder.product_name,
          amount: newOrder.amount,
          status: "pending",
          created_at: newOrder.created_at
        })
      });
    } catch (sheetErr) {
      console.error("Google Sheet webhook error:", sheetErr);
    }
  }

  return res.status(200).json({ success: true, order_code: newOrder.order_code, order: newOrder });
}
