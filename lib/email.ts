import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface TicketEmailData {
  ticketNumber: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  trackUrl: string;
}

interface ReplyEmailData {
  ticketNumber: string;
  userName: string;
  userEmail: string;
  subject: string;
  replyMessage: string;
  senderType: "admin" | "user";
  trackUrl: string;
}

export async function sendTicketCreatedEmail(data: TicketEmailData) {
  try {
    // Skip email in development if RESEND_API_KEY is not set
    if (!process.env.RESEND_API_KEY || !resend) {
      console.log("⚠️  RESEND_API_KEY not set, skipping email");
      console.log("📧 Email Preview:", {
        to: data.userEmail,
        subject: `[Ticket ${data.ticketNumber}] ได้รับการแจ้งปัญหาของคุณแล้ว`,
        ticketNumber: data.ticketNumber,
      });
      return { success: false, message: "Email disabled in development" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Thai MOOC Support <support@thaimooc.ac.th>",
      to: [data.userEmail],
      subject: `[Ticket ${data.ticketNumber}] ได้รับการแจ้งปัญหาของคุณแล้ว`,
      html: getTicketCreatedEmailHTML(data),
    });

    if (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent successfully:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendTicketReplyEmail(data: ReplyEmailData) {
  try {
    // Skip email in development if RESEND_API_KEY is not set
    if (!process.env.RESEND_API_KEY || !resend) {
      console.log("⚠️  RESEND_API_KEY not set, skipping email");
      console.log("📧 Email Preview:", {
        to: data.userEmail,
        subject: `[Ticket ${data.ticketNumber}] มีการตอบกลับใหม่`,
        ticketNumber: data.ticketNumber,
      });
      return { success: false, message: "Email disabled in development" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Thai MOOC Support <support@thaimooc.ac.th>",
      to: [data.userEmail],
      subject: `[Ticket ${data.ticketNumber}] มีการตอบกลับใหม่`,
      html: getTicketReplyEmailHTML(data),
    });

    if (error) {
      console.error("❌ Failed to send email:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent successfully:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

function getTicketCreatedEmailHTML(data: TicketEmailData): string {
  const priorityColors: Record<string, string> = {
    low: "#6B7280",
    normal: "#3B82F6",
    high: "#F97316",
    urgent: "#EF4444",
  };

  const priorityLabels: Record<string, string> = {
    low: "ต่ำ",
    normal: "ปกติ",
    high: "สูง",
    urgent: "ด่วนมาก",
  };

  const priorityColor = priorityColors[data.priority] || "#3B82F6";
  const priorityLabel = priorityLabels[data.priority] || data.priority;

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ได้รับการแจ้งปัญหาของคุณแล้ว</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2563EB; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                ✅ ได้รับการแจ้งปัญหาของคุณแล้ว
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                สวัสดีคุณ <strong>${data.userName}</strong>
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                ขอบคุณที่แจ้งปัญหากับเรา เราได้รับการแจ้งปัญหาของคุณเรียบร้อยแล้ว ทีมงานจะตรวจสอบและติดต่อกลับภายใน <strong>1-2 วันทำการ</strong>
              </p>

              <!-- Ticket Details -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td style="background-color: #F3F4F6; padding: 20px; border-radius: 8px;">
                    <table role="presentation" style="width: 100%;">
                      <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">หมายเลข Ticket:</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 16px; font-weight: bold; text-align: right;">
                          ${data.ticketNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">หัวข้อ:</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                          ${data.subject}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">ประเภท:</td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                          ${data.category}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">ความสำคัญ:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="background-color: ${priorityColor}; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            ${priorityLabel}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Track Button -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.trackUrl}" style="display: inline-block; background-color: #2563EB; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      🔍 ติดตามสถานะ Ticket
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #6B7280;">
                คุณสามารถติดตามสถานะการดำเนินการได้ทุกเมื่อผ่านทางลิงก์ด้านบน หรือไปที่หน้า <a href="${data.trackUrl}" style="color: #2563EB;">ติดตามสถานะ Ticket</a> และกรอก:
              </p>

              <ul style="margin: 10px 0 20px; padding-left: 20px; font-size: 14px; color: #6B7280;">
                <li>หมายเลข Ticket: <strong style="color: #111827;">${data.ticketNumber}</strong></li>
                <li>อีเมล: <strong style="color: #111827;">${data.userEmail}</strong></li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F4F6; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
                อีเมลนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับที่อีเมลนี้
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © 2025 Thai MOOC Platform. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function getTicketReplyEmailHTML(data: ReplyEmailData): string {
  const senderLabel = data.senderType === "admin" ? "เจ้าหน้าที่" : "คุณ";
  const senderIcon = data.senderType === "admin" ? "🛠️" : "👤";

  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>มีการตอบกลับใหม่</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #10B981; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                💬 มีการตอบกลับใหม่
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                สวัสดีคุณ <strong>${data.userName}</strong>
              </p>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #374151;">
                มีการตอบกลับใหม่สำหรับ Ticket <strong>${data.ticketNumber}</strong>
              </p>

              <!-- Ticket Info -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="background-color: #F3F4F6; padding: 20px; border-radius: 8px;">
                    <p style="margin: 0 0 10px; color: #6B7280; font-size: 14px;">หัวข้อ:</p>
                    <p style="margin: 0 0 20px; color: #111827; font-size: 16px; font-weight: bold;">
                      ${data.subject}
                    </p>

                    <p style="margin: 0 0 10px; color: #6B7280; font-size: 14px;">
                      ${senderIcon} ข้อความจาก: <strong>${senderLabel}</strong>
                    </p>
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #10B981;">
                      ${data.replyMessage}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Track Button -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.trackUrl}" style="display: inline-block; background-color: #10B981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      💬 ดูข้อความและตอบกลับ
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #6B7280;">
                คลิกปุ่มด้านบนเพื่อดูข้อความทั้งหมดและตอบกลับ
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F3F4F6; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #6B7280;">
                อีเมลนี้ส่งอัตโนมัติ กรุณาอย่าตอบกลับที่อีเมลนี้
              </p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                © 2025 Thai MOOC Platform. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Send a test SMTP email using provided configuration
 */
export async function sendSmtpEmail(
  config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    from: string;
  },
  to: string,
  subject: string,
  html: string
) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject,
      html,
    });

    console.log("✅ SMTP Test Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ SMTP Test Error:", error);
    return { success: false, error };
  }
}

