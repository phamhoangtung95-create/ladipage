export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { order_code } = req.query;
  if (!order_code) {
    return res.status(400).json({ error: "Missing order_code" });
  }

  const SEPAY_TOKEN = "NYZMQQ1FGWOUCPC3KKMIUZAOYYEWG9IDBFAS2RK702S5VTWURSNKXIADTCJFZNAM";
  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbw8tJe-h4inUDXiPWgdNQqd7P1MhvMnWFQZ4A_1_1cYzL9NwZennY2IoVcU39KXeVuyXg/exec";
  const SUPABASE_URL = process.env.SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

  try {
    const response = await fetch("https://my.sepay.vn/userapi/transactions/list", {
      headers: {
        "Authorization": `Bearer ${SEPAY_TOKEN}`
      }
    });

    if (!response.ok) {
      return res.status(200).json({ status: "pending" });
    }

    const data = await response.json();
    const transactions = data.transactions || [];

    for (const t of transactions) {
      const content = `${t.transaction_content || ""} ${t.code || ""} ${t.description || ""}`;
      const amountIn = parseFloat(t.amount_in || 0);
      if (content.toUpperCase().includes(order_code.toUpperCase()) && amountIn > 0) {
        
        // Cập nhật trạng thái đơn thành success trong Google Sheet
        if (GOOGLE_SHEET_URL) {
          try {
            await fetch(GOOGLE_SHEET_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "update_status", order_code, status: "success" })
            });
          } catch(e) {}
        }

        // Cập nhật Supabase nếu có
        if (SUPABASE_URL && SUPABASE_KEY) {
          try {
            await fetch(`${SUPABASE_URL}/rest/v1/orders?order_code=eq.${order_code}`, {
              method: "PATCH",
              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ status: "success" })
            });
          } catch(e) {}
        }

        return res.status(200).json({
          status: "success",
          transaction: {
            id: t.id,
            amount: amountIn,
            date: t.transaction_date
          }
        });
      }
    }

    return res.status(200).json({ status: "pending" });
  } catch (err) {
    return res.status(200).json({ status: "pending", error: err.message });
  }
}
