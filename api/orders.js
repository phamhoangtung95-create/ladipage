// Cache toàn cục lưu trữ các đơn hàng mới tạo trên Vercel Serverless instance
if (!global.__PENDING_ORDERS__) {
  global.__PENDING_ORDERS__ = [];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SEPAY_TOKEN = "NYZMQQ1FGWOUCPC3KKMIUZAOYYEWG9IDBFAS2RK702S5VTWURSNKXIADTCJFZNAM";
  const GOOGLE_SHEET_URL = process.env.GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbw8tJe-h4inUDXiPWgdNQqd7P1MhvMnWFQZ4A_1_1cYzL9NwZennY2IoVcU39KXeVuyXg/exec";

  // ================= 1. XỬ LÝ KHI TẠO ĐƠN HÀNG (POST) =================
  if (req.method === 'POST') {
    const body = req.body || {};
    const newOrder = {
      id: Date.now(),
      order_code: body.order_code || `DH${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: body.customer_name || "Khách hàng",
      phone: body.phone || "",
      email: body.email || "",
      zalo: body.zalo || "",
      product_name: body.product_name || "Sản phẩm",
      product_type: body.product_type || "digital",
      amount: parseFloat(body.amount || 0),
      status: body.status || "pending",
      created_at: body.created_at || new Date().toLocaleString("vi-VN")
    };

    // Đưa vào đầu danh sách cache
    global.__PENDING_ORDERS__.unshift(newOrder);
    if (global.__PENDING_ORDERS__.length > 100) {
      global.__PENDING_ORDERS__.pop();
    }

    // Gửi tiếp về Google Sheet Webhook
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
      } catch(err) {
        console.error("Lỗi gửi Sheet:", err);
      }
    }

    return res.status(200).json({ success: true, order_code: newOrder.order_code, order: newOrder });
  }

  // ================= 2. XỬ LÝ KHI LẤY DANH SÁCH ĐƠN HÀNG (GET) =================
  let ordersMap = new Map();

  // A. Thử đọc toàn bộ đơn hàng từ Google Sheet (nếu Google Sheet đã có hàm doGet)
  if (GOOGLE_SHEET_URL) {
    try {
      const sheetResp = await fetch(GOOGLE_SHEET_URL);
      if (sheetResp.ok) {
        const text = await sheetResp.text();
        // Kiểm tra nếu trả về đúng chuỗi JSON
        if (text && text.trim().startsWith("[")) {
          const sheetOrders = JSON.parse(text);
          sheetOrders.forEach(o => {
            if (o.order_code) {
              ordersMap.set(o.order_code, {
                id: o.id || Math.floor(Math.random() * 10000),
                order_code: o.order_code,
                customer_name: o.customer_name || "Khách hàng",
                phone: o.phone || "",
                email: o.email || "",
                zalo: o.zalo || "",
                product_name: o.product_name || "Sản phẩm",
                product_type: "digital",
                amount: parseFloat(o.amount || 0),
                status: o.status || "pending",
                created_at: o.created_at || ""
              });
            }
          });
        }
      }
    } catch(sheetErr) {
      console.log("Google Sheet chưa bật doGet:", sheetErr.message);
    }
  }

  // B. Nạp các đơn pending trong bộ nhớ đệm
  if (global.__PENDING_ORDERS__ && global.__PENDING_ORDERS__.length > 0) {
    global.__PENDING_ORDERS__.forEach(o => {
      if (!ordersMap.has(o.order_code)) {
        ordersMap.set(o.order_code, o);
      }
    });
  }

  // C. Đồng bộ với giao dịch thực tế trên SePay API (nếu đơn đã được chuyển khoản)
  try {
    const response = await fetch("https://my.sepay.vn/userapi/transactions/list", {
      headers: { "Authorization": `Bearer ${SEPAY_TOKEN}` }
    });
    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions || [];
      transactions.forEach((t, idx) => {
        const content = t.transaction_content || "";
        const match = content.match(/DH[0-9]{4,6}/i);
        const code = match ? match[0].toUpperCase() : `SEPAY_${t.id}`;
        const amount = parseFloat(t.amount_in || 0);

        if (ordersMap.has(code)) {
          // Nếu đơn đã có trong danh sách và khách đã chuyển tiền -> Cập nhật thành success
          const existing = ordersMap.get(code);
          existing.status = "success";
          ordersMap.set(code, existing);
        } else {
          // Đơn thanh toán trực tiếp qua SePay chưa có trong web
          ordersMap.set(code, {
            id: 200 + idx,
            order_code: code,
            customer_name: `Khách chuyển khoản MBBank (${t.account_number || "MB"})` ,
            phone: "09xxxx",
            email: "sepay@gateway.vn",
            product_name: amount === 2000 ? "Gói Test Chuyển Khoản Tự Động" : "Checklist 10 Điểm Chết Hợp Đồng Bảo Hiểm",
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

  // D. Thêm đơn mẫu mặc định nếu danh sách trống
  if (ordersMap.size === 0) {
    ordersMap.set("DH7007", {
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
    });
  }

  const result = Array.from(ordersMap.values());
  return res.status(200).json(result);
}
