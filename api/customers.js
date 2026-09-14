if (!global.__CUSTOMERS__) {
  global.__CUSTOMERS__ = [
    { id: 1, name: "Nguyễn Thị Mai", phone: "0912345678", email: "mai.nguyen@gmail.com", zalo: "0912345678", registered_at: "2026-09-09 09:15:00" },
    { id: 2, name: "Trần Thu Hà", phone: "0987654321", email: "ha.tran@gmail.com", zalo: "0987654321", registered_at: "2026-09-09 14:30:00" },
    { id: 3, name: "Lê Hoàng Yến", phone: "0903123456", email: "yen.le@gmail.com", zalo: "0903123456", registered_at: "2026-09-10 11:20:00" },
    { id: 4, name: "Phạm Quỳnh Chi", phone: "0945678901", email: "chi.pham@gmail.com", zalo: "0945678901", registered_at: "2026-09-10 16:45:00" },
    { id: 5, name: "Vũ Bích Ngọc", phone: "0932112233", email: "ngoc.vu@gmail.com", zalo: "0932112233", registered_at: "2026-09-11 08:50:00" },
    { id: 6, name: "Đỗ Thu Hương", phone: "0977889900", email: "huong.do@gmail.com", zalo: "0977889900", registered_at: "2026-09-12 20:10:00" }
  ];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query || {};

  if (req.method === 'POST') {
    const body = req.body || {};
    const newCust = {
      id: Date.now(),
      name: body.name || "Khách hàng mới",
      phone: body.phone || "",
      email: body.email || "",
      zalo: body.zalo || body.phone || "",
      registered_at: new Date().toLocaleString("vi-VN")
    };
    global.__CUSTOMERS__.unshift(newCust);
    return res.status(201).json({ success: true, customer: newCust });
  }

  if (req.method === 'PUT') {
    const body = req.body || {};
    const targetId = parseInt(id || body.id);
    const index = global.__CUSTOMERS__.findIndex(c => c.id === targetId);
    if (index !== -1) {
      global.__CUSTOMERS__[index] = {
        ...global.__CUSTOMERS__[index],
        name: body.name !== undefined ? body.name : global.__CUSTOMERS__[index].name,
        phone: body.phone !== undefined ? body.phone : global.__CUSTOMERS__[index].phone,
        email: body.email !== undefined ? body.email : global.__CUSTOMERS__[index].email,
        zalo: body.zalo !== undefined ? body.zalo : global.__CUSTOMERS__[index].zalo
      };
      return res.status(200).json({ success: true, customer: global.__CUSTOMERS__[index] });
    }
    return res.status(404).json({ error: "Customer not found" });
  }

  if (req.method === 'DELETE') {
    const targetId = parseInt(id);
    global.__CUSTOMERS__ = global.__CUSTOMERS__.filter(c => c.id !== targetId);
    return res.status(200).json({ success: true });
  }

  return res.status(200).json(global.__CUSTOMERS__);
}
