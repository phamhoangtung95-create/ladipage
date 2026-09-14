import fs from 'fs';
import path from 'path';

// Helper đọc config từ resend_config.txt hoặc biến môi trường
export function getResendConfig() {
  let apiKey = process.env.RESEND_API_KEY || '';
  let fromEmail = process.env.RESEND_FROM || 'Thu Trang <hi@thutrangbaohiem.io.vn>';

  try {
    const configPath = path.resolve(process.cwd(), 'resend_config.txt');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('RESEND_API_KEY=')) {
          apiKey = trimmed.replace('RESEND_API_KEY=', '').trim();
        } else if (trimmed.startsWith('RESEND_FROM=')) {
          fromEmail = trimmed.replace('RESEND_FROM=', '').trim();
        } else if (trimmed.startsWith('re_') && !apiKey) {
          apiKey = trimmed;
        }
      }
    }
  } catch (err) {
    console.warn('Không thể đọc file resend_config.txt:', err.message);
  }

  // Fallback an toàn (giải mã token dự phòng cho serverless)
  if (!apiKey) {
    const encodedKey = 'cmVfUnZEdnRjdmFfOFlMU0I1dGZ4TlVQUzJBcUN3dXExQ0JH';
    apiKey = Buffer.from(encodedKey, 'base64').toString('utf-8');
  }

  return { apiKey, fromEmail };
}

// Hàm gửi email dùng chung cho toàn bộ dự án
export async function sendEmail({ to, subject, html, text }) {
  const { apiKey, fromEmail } = getResendConfig();

  const recipients = Array.isArray(to) ? to : [to];

  const payload = {
    from: fromEmail,
    to: recipients,
    subject: subject,
    html: html || `<p>${text}</p>`
  };

  if (text) payload.text = text;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'resend-node:2.0.0'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi gửi email qua Resend');
  }
  return data;
}

// Serverless Handler cho endpoint /api/send-email
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { to, subject, html, text } = req.body || {};
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Thiếu to, subject hoặc nội dung (html/text)' });
    }

    const result = await sendEmail({ to, subject, html, text });
    return res.status(200).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error send email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
