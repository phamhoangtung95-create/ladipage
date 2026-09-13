export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { order_code } = req.query;
  if (!order_code) {
    return res.status(400).json({ error: "Missing order_code" });
  }

  const SEPAY_TOKEN = "NYZMQQ1FGWOUCPC3KKMIUZAOYYEWG9IDBFAS2RK702S5VTWURSNKXIADTCJFZNAM";

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
