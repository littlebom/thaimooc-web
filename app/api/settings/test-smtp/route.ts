import { NextRequest, NextResponse } from "next/server";
import { sendSmtpEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure, smtpFromEmail, toEmail } = body;

        // Validate required fields
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !toEmail) {
            return NextResponse.json(
                { success: false, error: "Missing required SMTP configuration or recipient email." },
                { status: 400 }
            );
        }

        const config = {
            host: smtpHost,
            port: parseInt(smtpPort),
            user: smtpUser,
            pass: smtpPassword,
            secure: smtpSecure === true || smtpSecure === "true", // Handle string/boolean
            from: smtpFromEmail || smtpUser, // Fallback to user email if from not specified
        };

        const subject = "Thai MOOC - SMTP Test Email";
        const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563EB;">SMTP Configuration Test</h2>
        <p>This is a test email sent from your Thai MOOC platform.</p>
        <p><strong>Configuration Used:</strong></p>
        <ul>
          <li><strong>Host:</strong> ${config.host}</li>
          <li><strong>Port:</strong> ${config.port}</li>
          <li><strong>Secure:</strong> ${config.secure ? "Yes" : "No"}</li>
          <li><strong>User:</strong> ${config.user}</li>
        </ul>
        <p style="color: green; font-weight: bold;">✅ If you are reading this, your SMTP settings are correct!</p>
      </div>
    `;

        const result = await sendSmtpEmail(config, toEmail, subject, html);

        if (result.success) {
            return NextResponse.json({ success: true, message: "Test email sent successfully" });
        } else {
            let errorMessage = "Failed to send email";

            // Refine error message based on common issues
            const errorAny = result.error as any;
            if (errorAny?.code === 'ESOCKET' && (errorAny?.reason?.includes('wrong version number') || errorAny?.library === 'SSL routines')) {
                errorMessage = "SSL/TLS mismatched. If using Port 587, try disabling 'Secure Connection'. If using Port 465, enable it.";
            } else if (errorAny?.code === 'EAUTH') {
                errorMessage = "Authentication failed. Please check your username and password (or App Password).";
            } else if (errorAny?.response) {
                errorMessage = `SMTP Error: ${errorAny.response}`;
            }

            return NextResponse.json(
                { success: false, error: errorMessage, details: result.error },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Test SMTP Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
