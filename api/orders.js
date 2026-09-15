// Cache toàn cục lưu trữ các đơn hàng mới tạo trên Vercel Serverless instance
if (!global.__PENDING_ORDERS__) {
  global.__PENDING_ORDERS__ = [];
}
if (!global.__STATUS_OVERRIDES__) {
  global.__STATUS_OVERRIDES__ = {};
}


// Template HTML email xác nhận đơn hàng chuẩn Brand Voice Thu Trang
function getOrderConfirmationEmail(order) {
  const customerName = order.customer_name || "Quý khách";
  const amountFormatted = Number(order.amount || 0).toLocaleString("vi-VN");
  const isPhysical = order.product_type === "physical";
  const statusText = order.status === "success" ? "Đã thanh toán thành công" : "Đã tiếp nhận (Đang xử lý)";

  return {
    subject: `[Thu Trang] Xác nhận đơn hàng #${order.order_code} — Cảm ơn bạn đã tin tưởng! 🌸`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; font-size: 15px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ffe4e6;">
          <h2 style="color: #e11d48; margin: 0; font-size: 20px;">Thu Trang | TrangPyBảoHiểm</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Xác nhận đơn hàng và hướng dẫn nhận tài liệu</p>
        </div>

        <p>Chào <strong>${customerName}</strong>,</p>

        <p>Trang vừa nhận được thông tin đơn hàng của bạn trên hệ thống. Thật sự lúc này mình rất vui và xúc động khi nhận được sự gửi gắm, tin tưởng của bạn dành cho Trang!</p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin: 0 0 12px; font-size: 16px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">🧾 THÔNG TIN ĐƠN HÀNG</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Mã đơn hàng:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #e11d48; text-align: right;">#${order.order_code}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Sản phẩm:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${order.product_name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Số tiền:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${amountFormatted} VNĐ</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Trạng thái:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #059669; text-align: right;">${statusText}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-weight: bold; color: #9f1239;">📦 HƯỚNG DẪN NHẬN HÀNG:</p>
          ${isPhysical ? `
            <p style="margin: 0; font-size: 14px; color: #475569;">
              Vì đây là <strong>sản phẩm vật lý (Sách in)</strong>, Trang sẽ trực tiếp đóng gói cẩn thận và gửi chuyển phát nhanh đến địa chỉ của bạn trong 1 – 3 ngày tới. Bưu tá sẽ liên hệ với bạn trước khi giao qua số điện thoại <strong>${order.phone || 'của bạn'}</strong>.
            </p>
          ` : `
            <p style="margin: 0 0 12px; font-size: 14px; color: #475569;">
              Vì đây là <strong>tài liệu số</strong>, bạn có thể bấm vào nút bên dưới để tải và đọc ngay bộ tài liệu Checklist / Cẩm nang trên điện thoại hoặc máy tính:
            </p>
            <div style="text-align: center; margin: 10px 0;">
              <a href="https://thutrangbaohiem.io.vn/checklist" style="display: inline-block; background: #e11d48; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(225, 29, 72, 0.2);">
                📥 BẤM ĐỂ TẢI TÀI LIỆU CỦA BẠN NGAY →
              </a>
            </div>
          `}
        </div>

        <p>8 năm làm nghề, Trang luôn tâm niệm: Mỗi khách hàng tìm đến mình không chỉ để mua một sản phẩm hay một cuốn cẩm nang, mà là tìm kiếm một sự an tâm thực sự.</p>

        <p>Nếu trong quá trình đọc tài liệu hay rà soát hợp đồng bảo hiểm của gia đình, bạn có bất kỳ điều khoản nào băn khoăn, đừng ngần ngại nhắn tin trực tiếp cho Trang qua Zalo nhé. Trang luôn sẵn lòng kề vai hỗ trợ bạn!</p>

        <p>Chúc bạn và gia đình luôn dồi dào sức khỏe, an yên và vạn sự như ý!</p>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px;"><strong>Thu Trang (TrangPyBảoHiểm)</strong></p>
          <p style="margin: 0 0 4px;">Hotline/Zalo hỗ trợ 1-1: <strong>0354 859 568</strong></p>
          <p style="margin: 0;">Website chính thức: <a href="https://thutrangbaohiem.io.vn" style="color: #e11d48; text-decoration: none;">https://thutrangbaohiem.io.vn</a></p>
        </div>
      </div>
    `
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SEPAY_TOKEN = process.env.SEPAY_TOKEN || "NYZMQQ1FGWOUCPC3KKMIUZAOYYEWG9IDBFAS2RK702S5VTWURSNKXIADTCJFZNAM";
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

    // Tự động gửi Email xác nhận đơn hàng qua Resend API
    let emailSentResult = null;
    if (newOrder.email) {
      try {
        const { getResendConfig } = await import('./send-email.js');
        const { apiKey, fromEmail } = getResendConfig();
        const emailContent = getOrderConfirmationEmail(newOrder);

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'resend-node:2.0.0'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [newOrder.email],
            subject: emailContent.subject,
            html: emailContent.html
          })
        });
        emailSentResult = await emailRes.json();
        console.log(`[Order Email] Đã gửi email xác nhận cho đơn ${newOrder.order_code} tới ${newOrder.email}:`, emailSentResult.id);
      } catch (errEmail) {
        console.error("Lỗi gửi email xác nhận đơn hàng:", errEmail);
      }
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
            status: newOrder.status,
            created_at: newOrder.created_at
          })
        });
      } catch(err) {
        console.error("Lỗi gửi Sheet:", err);
      }
    }

    return res.status(200).json({
      success: true,
      order_code: newOrder.order_code,
      order: newOrder,
      email_sent: !!emailSentResult?.id
    });
  }

    // ================= XỬ LÝ CẬP NHẬT TRẠNG THÁI (PUT) =================
  if (req.method === 'PUT') {
    const { id, order_code } = req.query;
    const body = req.body || {};
    const targetCode = (order_code || body.order_code || "").toUpperCase();
    const targetId = String(id || body.id || "");
    const newStatus = body.status || 'success';

    if (!global.__PENDING_ORDERS__) {
      global.__PENDING_ORDERS__ = [];
    }

    // Tìm đơn trong cache
    let found = global.__PENDING_ORDERS__.find(o => 
      (targetCode && String(o.order_code).toUpperCase() === targetCode) ||
      (targetId && String(o.id) === targetId)
    );

    if (found) {
      found.status = newStatus;
    } else if (targetCode) {
      // Nếu đơn chưa có trong cache (ví dụ SePay hoặc mẫu), thêm vào cache với status mới
      found = {
        id: targetId || Date.now(),
        order_code: targetCode,
        status: newStatus
      };
      global.__PENDING_ORDERS__.unshift(found);
    }

    // Đồng bộ trạng thái mới sang Google Sheet Webhook
    if (GOOGLE_SHEET_URL && targetCode) {
      try {
        await fetch(GOOGLE_SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_status",
            order_code: targetCode,
            status: newStatus
          })
        });
      } catch(e) {
        console.error("Lỗi sync update Google Sheet:", e);
      }
    }

    if (targetCode) {
      global.__STATUS_OVERRIDES__[targetCode] = newStatus;
    }
    return res.status(200).json({ success: true, order_code: targetCode, status: newStatus });
  }

  // ================= XỬ LÝ XÓA ĐƠN (DELETE) =================
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (global.__PENDING_ORDERS__) {
      global.__PENDING_ORDERS__ = global.__PENDING_ORDERS__.filter(o => String(o.id) !== String(id));
    }
    return res.status(200).json({ success: true });
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

  // Áp dụng các thay đổi trạng thái thủ công (Override) từ Admin
  if (global.__STATUS_OVERRIDES__) {
    for (const [code, overrideStatus] of Object.entries(global.__STATUS_OVERRIDES__)) {
      if (ordersMap.has(code)) {
        const item = ordersMap.get(code);
        item.status = overrideStatus;
        ordersMap.set(code, item);
      }
    }
  }

  const result = Array.from(ordersMap.values());
  return res.status(200).json(result);
}
