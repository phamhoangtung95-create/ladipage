export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SEPAY_TOKEN = "NYZMQQ1FGWOUCPC3KKMIUZAOYYEWG9IDBFAS2RK702S5VTWURSNKXIADTCJFZNAM";
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbw8tJe-h4inUDXiPWgdNQqd7P1MhvMnWFQZ4A_1_1cYzL9NwZennY2IoVcU39KXeVuyXg/exec";

  if (req.method === 'POST') {
    const body = req.body || {};
    try {
      if (GOOGLE_SHEET_URL) {
        await fetch(GOOGLE_SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      }
    } catch(e) {}
    return res.status(201).json({ success: true, id: Date.now() });
  }

  // Khi GET: Lấy danh sách giao dịch thực tế từ SePay API + đơn hàng mẫu
  let liveOrders = [
    {
      id: 1,
      order_code: "DH7007",
      customer_name: "Nguyễn Văn Test (Thực tế MBBank)",
      phone: "0392122895",
      email: "test@gmail.com",
      product_name: "Gói Test Chuyển Khoản Tự Động",
      product_type: "digital",
      amount: 2000,
      status: "success",
      created_at: "2026-09-14 00:35:00"
    },
    {
      id: 2,
      order_code: "DH1001",
      customer_name: "Nguyễn Thị Mai",
      phone: "0912345678",
      email: "mai.nguyen@gmail.com",
      product_name: "Checklist 10 Điểm Chết Hợp Đồng Bảo Hiểm",
      product_type: "digital",
      amount: 69000,
      status: "success",
      created_at: "2026-09-12 10:30:00"
    }
  ];

  try {
    const response = await fetch("https://my.sepay.vn/userapi/transactions/list", {
      headers: { "Authorization": `Bearer ${SEPAY_TOKEN}` }
    });
    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions || [];
      transactions.forEach((t, idx) => {
        const content = t.transaction_content || "";
        // Tìm mã đơn DHxxxx trong nội dung chuyển khoản
        const match = content.match(/DH[0-9]{4,6}/i);
        const code = match ? match[0].toUpperCase() : `SEPAY_${t.id}`;
        const amount = parseFloat(t.amount_in || 0);

        if (!liveOrders.some(o => o.order_code === code)) {
          liveOrders.unshift({
            id: 100 + idx,
            order_code: code,
            customer_name: `Khách chuyển MBBank (${t.account_number || "MB"})` ,
            phone: "09xxxx",
            email: "sepay@gateway.vn",
            product_name: amount === 2000 ? "Gói Test Chuyển Khoản" : "Checklist 10 Điểm Chết Hợp Đồng",
            product_type: "digital",
            amount: amount,
            status: "success",
            created_at: t.transaction_date || new Date().toISOString()
          });
        }
      });
    }
  } catch(e) {
    console.error("SePay fetch error:", e);
  }

  return res.status(200).json(liveOrders);
}
