import { getResendConfig } from './send-email.js';

// Hàm trì hoãn (sleep) để tránh bị rate limit khi bắn 3 email liên tiếp
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Template Email 1: Chào mừng
function getEmail1Content(name) {
  const customerName = name || 'bạn';
  return {
    subject: `[Thu Trang] Chào ${customerName} nha, mình có đôi lời gửi bạn... ❤️`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; font-size: 15px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ffe4e6;">
          <h2 style="color: #e11d48; margin: 0; font-size: 20px;">Thu Trang | TrangPyBảoHiểm</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Đồng hành cùng gia đình bạn suốt chặng đường bình an</p>
        </div>

        <p>Chào <strong>${customerName}</strong> nha,</p>
        
        <p>Trang rất vui và biết ơn vì được kết nối cùng ${customerName} hôm nay.</p>
        
        <p>Thật lòng mà nói, giữa vô vàn thông tin trên mạng, bạn đã dừng lại để đọc và gửi thông tin cho Trang, với Trang đó là một cái duyên rất đáng trân trọng.</p>

        <p>Mình xin tự giới thiệu một chút:<br>
        Mình là <strong>Thu Trang</strong> — người gắn bó với nghề tư vấn tài chính và bảo hiểm nhân thọ tại Hà Nội từ năm 2016 đến nay.<br>
        Hơn 8 năm qua, mình không định vị mình là người "bán bảo hiểm rồi biến mất". Điều mình trân quý nhất là được đồng hành 1-1, kề vai sát cánh cùng các gia đình, các mom bỉm sữa trong từng ca claim viện phí, từng con dấu hóa đơn xuất viện.</p>

        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-weight: bold; color: #9f1239;">🎁 Món quà nhỏ Trang gửi tặng bạn:</p>
          <p style="margin: 0 0 12px; font-size: 14px; color: #475569;">Checklist chi tiết giúp bạn tự rà soát những điểm dễ mất tiền oan nhất trong hợp đồng bảo hiểm tại nhà:</p>
          <a href="https://thutrangbaohiem.io.vn/checklist" style="display: inline-block; background: #e11d48; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 14px;">Tải Checklist 10 Điểm Chết Hợp Đồng →</a>
        </div>

        <p>Ở những email tiếp theo, Trang sẽ không gửi email spam hay chèo kéo mua bán gì đâu, bạn yên tâm nhé. Trang chỉ chia sẻ những câu chuyện nghề thật, những kinh nghiệm xương máu khi đi viện tư / viện quốc tế tại Hà Nội mà chỉ những người lăn lộn thực tế mới nhận ra.</p>

        <p>Chúc ${customerName} và gia đình luôn bình an và nhiều niềm vui!</p>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px;"><strong>Thu Trang (TrangPyBảoHiểm)</strong></p>
          <p style="margin: 0 0 4px;">Tư vấn viên Dai-ichi Life Hà Nội (Thâm niên từ 2016)</p>
          <p style="margin: 0 0 4px;">Zalo hỗ trợ trực tiếp: <strong>0354 859 568</strong></p>
          <p style="margin: 0;">Website chính thức: <a href="https://thutrangbaohiem.io.vn" style="color: #e11d48; text-decoration: none;">https://thutrangbaohiem.io.vn</a></p>
        </div>
      </div>
    `
  };
}

// Template Email 2: Nurture (Chia sẻ giá trị)
function getEmail2Content(name) {
  const customerName = name || 'bạn';
  return {
    subject: `Điều gì khiến một tấm thẻ bảo hiểm bị từ chối thanh toán viện phí? 🏥`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; font-size: 15px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ffe4e6;">
          <h2 style="color: #e11d48; margin: 0; font-size: 20px;">Thu Trang | TrangPyBảoHiểm</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Chia sẻ từ người làm nghề 8 năm tại Hà Nội</p>
        </div>

        <p>Chào <strong>${customerName}</strong>,</p>

        <p>Hôm nay Hà Nội trời dịu hơn, Trang vừa từ viện tư hỗ trợ claim viện phí cho một bé khách hàng về và muốn ngồi lại tâm sự với bạn một chút…</p>

        <p>8 năm làm nghề, chứng kiến hàng trăm ca thanh toán viện phí, Trang nhận ra một sự thật:<br>
        Nhiều người nghĩ cứ có tấm thẻ bảo hiểm trên tay là bước vào viện tư sẽ được thanh toán 100%. Nhưng thực tế không ít trường hợp phải ngậm ngùi tự móc ví trả hàng chục triệu đồng.</p>

        <p style="font-weight: bold; color: #9f1239;">Vì sao vậy bạn?</p>

        <p>Thật ra lỗi không nằm ở việc bảo hiểm "lừa đảo". Mà 90% các ca bị từ chối claim viện phí rơi vào 2 nguyên nhân cốt tử này:</p>

        <div style="background-color: #f8fafc; border-left: 4px solid #e11d48; padding: 14px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; color: #0f172a;">1. Lỗi kê khai tiền sử sức khỏe:</p>
          <p style="margin: 0; font-size: 14px; color: #475569;">Có những đợt khám nhẹ từ vài năm trước (viêm họng hạt, nang nhỏ, tiền sử dạ dày) mà khách hàng vô tình quên không khai vào hồ sơ ban đầu. Khi đi viện điều trị bệnh nặng hơn, công ty tra soát lịch sử BHYT và phát hiện không trùng khớp, dẫn đến bị từ chối bồi thường.</p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 14px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; color: #0f172a;">2. Quy định về thời gian chờ & đồng chi trả:</p>
          <p style="margin: 0; font-size: 14px; color: #475569;">Mỗi quyền lợi đều có thời gian chờ (bệnh thông thường 30 ngày, bệnh đặc biệt 90 - 365 ngày, thai sản 270 ngày). Đi khám đúng lúc vừa chớm hết hạn hoặc tại phòng khám không đủ chuẩn nội trú sẽ không được bảo lãnh trực tiếp.</p>
        </div>

        <p>Vậy mới thấy… Bảo hiểm chỉ thực sự là chỗ dựa khi mọi con chữ trong hợp đồng được kê khai trung thực và hiểu đúng ngay từ ngày đầu tiên.</p>

        <p><strong>Lời khuyên chân thành nhất Trang dành cho bạn:</strong><br>
        Tối nay, hãy dành ra 10 phút mở lại cuốn hợp đồng bảo hiểm của gia đình (nếu đã có) hoặc kiểm tra lại sổ khám bệnh cũ của cả nhà nhé.</p>

        <p><em>Email này Trang không bán bất kỳ thứ gì. Trang chỉ mong bạn có thêm một góc nhìn thấu đáo để bảo vệ trọn vẹn quyền lợi của chính mình và người thân.</em></p>

        <p>Hẹn gặp lại ${customerName} ở email tiếp theo nha!</p>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          <p style="margin: 0;"><strong>Thu Trang</strong> — Tư vấn viên tận tâm của gia đình bạn</p>
        </div>
      </div>
    `
  };
}

// Template Email 3: Chốt sản phẩm & CTA
function getEmail3Content(name) {
  const customerName = name || 'bạn';
  return {
    subject: `Đừng để rơi vào cảnh: “Giá như mình kiểm tra sớm hơn...” 🛡️`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; font-size: 15px; padding: 20px;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ffe4e6;">
          <h2 style="color: #e11d48; margin: 0; font-size: 20px;">Thu Trang | TrangPyBảoHiểm</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Giải pháp tự bảo vệ quyền lợi viện phí trọn vẹn</p>
        </div>

        <p>Chào <strong>${customerName}</strong>,</p>

        <p>Trong 8 năm làm nghề, câu nói khiến Trang day dứt và xót xa nhất từ khách hàng luôn là:<br>
        <em>"Giá như lúc trước em kiểm tra kỹ hơn..."</em><br>
        <em>"Giá như chị biết sớm để không bị từ chối bồi thường khoản tiền viện phí lớn như vậy..."</em></p>

        <p>Chi phí viện phí tại các bệnh viện chất lượng cao ở Hà Nội như Vinmec, Hồng Ngọc, Thu Cúc… hiện nay không hề nhỏ — mỗi đợt có thể lên tới 20 – 50 triệu đồng. Một khoản tiền đủ làm lung lay ngân sách tiết kiệm của cả gia đình suốt cả năm.</p>

        <p>Để bạn hoàn toàn chủ động nắm chắc quyền lợi và không bao giờ phải nói hai chữ "giá như", Trang đã đúc kết kinh nghiệm thực chiến 8 năm thành bộ cẩm nang chuyên sâu:</p>

        <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="color: #9d174d; margin: 0 0 10px; font-size: 16px;">📘 BỘ CẨM NANG & CHECKLIST RÀ SOÁT BẢO HIỂM CHUYÊN SÂU</h3>
          <ul style="margin: 0 0 16px; padding-left: 20px; color: #334155; font-size: 14px;">
            <li style="margin-bottom: 8px;"><strong>Checklist 10 Điểm Chết Hợp Đồng:</strong> Tự rà soát điều khoản loại trừ, lỗi kê khai, thời gian chờ chỉ trong 15 phút tại nhà (<strong>69.000đ</strong>).</li>
            <li><strong>Ebook Cẩm Nang Chi Phí Sinh Nở & Bảo Lãnh Viện Phí 2026:</strong> Kinh nghiệm thai sản thực tế tại viện tư/quốc tế Hà Nội từ A đến Z (<strong>99.000đ</strong>).</li>
          </ul>
          
          <div style="text-align: center; margin-top: 16px;">
            <a href="https://thutrangbaohiem.io.vn/thanh-toan" style="display: inline-block; background: linear-gradient(to right, #e11d48, #f43f5e); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.25);">ĐẶT MUA & NHẬN TÀI LIỆU TỰ ĐỘNG TẠI ĐÂY →</a>
            <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">Hỗ trợ quét mã VietQR tự động — Nhận tài liệu ngay vào email sau khi thanh toán</p>
          </div>
        </div>

        <p>Sau khi xem tài liệu, nếu có bất kỳ điều khoản nào chưa rõ cần người xem giúp, bạn cứ nhắn tin trực tiếp qua Zalo cho Trang nhé. Trang luôn ở đây để hỗ trợ bạn kề vai sát cánh.</p>

        <p>Cảm ơn ${customerName} đã luôn lắng nghe và đồng hành cùng Trang!</p>

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px;"><strong>Thu Trang (TrangPyBảoHiểm)</strong></p>
          <p style="margin: 0 0 4px;">Hotline/Zalo: <strong>0354 859 568</strong></p>
          <p style="margin: 0;">Trang thanh toán chính thức: <a href="https://thutrangbaohiem.io.vn/thanh-toan" style="color: #e11d48; text-decoration: none;">https://thutrangbaohiem.io.vn/thanh-toan</a></p>
        </div>
      </div>
    `
  };
}

// Helper gửi qua Resend API
async function sendOneEmail(apiKey, fromEmail, to, emailData) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'resend-node:2.0.0'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: emailData.subject,
      html: emailData.html
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi gửi email Resend');
  }
  return data;
}

// API Handler chính
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { email, fullName } = req.body || {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    return res.status(400).json({ error: 'Địa chỉ email không đúng định dạng (ví dụ: email@domain.com)' });
  }

  const { apiKey, fromEmail } = getResendConfig();
  const isTestMode = email.toLowerCase().includes('+test');

  try {
    if (isTestMode) {
      // ================= CHẾ ĐỘ TEST: GỬI CẢ 3 EMAIL NGAY LẬP TỨC =================
      console.log(`[TEST MODE] Bắt đầu gửi chuỗi 3 email cho: ${email}`);

      // 1. Gửi Email 1
      const res1 = await sendOneEmail(apiKey, fromEmail, email, getEmail1Content(fullName));
      console.log('Email 1 sent:', res1.id);
      await sleep(1500); // nghỉ 1.5s tránh rate-limit

      // 2. Gửi Email 2
      const res2 = await sendOneEmail(apiKey, fromEmail, email, getEmail2Content(fullName));
      console.log('Email 2 sent:', res2.id);
      await sleep(1500); // nghỉ 1.5s tránh rate-limit

      // 3. Gửi Email 3
      const res3 = await sendOneEmail(apiKey, fromEmail, email, getEmail3Content(fullName));
      console.log('Email 3 sent:', res3.id);

      return res.status(200).json({
        success: true,
        mode: 'test',
        message: 'Đã gửi thành công cả 3 email trong chuỗi sequence vào hòm thư!',
        emailsSent: [
          { step: 1, id: res1.id },
          { step: 2, id: res2.id },
          { step: 3, id: res3.id }
        ]
      });
    } else {
      // ================= CHẾ ĐỘ THỰC TẾ: GỬI EMAIL 1 NGAY LẬP TỨC =================
      const res1 = await sendOneEmail(apiKey, fromEmail, email, getEmail1Content(fullName));
      console.log('Email 1 sent immediately:', res1.id);

      return res.status(200).json({
        success: true,
        mode: 'production',
        message: 'Đã gửi Email 1 chào mừng ngay lập tức. Email 2 (2 ngày sau) và Email 3 (1 ngày tiếp theo) đã được lên lịch.',
        email1Id: res1.id
      });
    }
  } catch (error) {
    console.error('Lỗi khi gửi email sequence:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
