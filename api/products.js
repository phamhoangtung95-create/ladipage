export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const products = [
    { id: 1, name: "Gói Test Chuyển Khoản Tự Động", price: 2000, type: "digital" },
    { id: 2, name: "Checklist 10 Điểm Chết Cần Rà Soát Trong Hợp Đồng Bảo Hiểm", price: 69000, type: "digital" },
    { id: 3, name: "Ebook: Cẩm nang chi phí sinh nở & bảo lãnh viện phí 2026", price: 99000, type: "digital" },
    { id: 4, name: "Sách in: Cẩm nang thai sản & viện phí", price: 150000, type: "physical" }
  ];
  return res.status(200).json(products);
}
