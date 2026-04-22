import nodemailer from "nodemailer";

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>FoodBridge</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#064e3b 0%,#0d9488 100%);border-radius:24px 24px 0 0;padding:40px 48px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">🌿</div>
            <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 6px;letter-spacing:-0.5px;">FoodBridge</h1>
            <p style="color:#6ee7b7;font-size:11px;margin:0;font-weight:700;text-transform:uppercase;letter-spacing:3px;">Connecting Communities Through Food</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:48px 48px 40px;border-radius:0 0 24px 24px;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
            ${content}
            <!-- Footer -->
            <hr style="border:none;border-top:1px solid #f3f4f6;margin:40px 0 28px;">
            <p style="color:#d1d5db;font-size:12px;text-align:center;margin:0;line-height:2;">
              This is an automated notification — please do not reply.<br>
              © ${new Date().getFullYear()} FoodBridge · Making every meal count.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const emailTemplates = {
  accepted: ({ name, foodDetails, volunteerName, volunteerPhone }) =>
    baseTemplate(`
      <div style="text-align:center;margin-bottom:36px;">
        <div style="display:inline-block;background:#ecfdf5;border:2px solid #6ee7b7;border-radius:100px;padding:10px 28px;">
          <span style="color:#059669;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">✓ Donation Accepted</span>
        </div>
      </div>

      <h2 style="color:#111827;font-size:26px;font-weight:900;margin:0 0 14px;line-height:1.3;">
        Great news, ${name}! 🎉
      </h2>
      <p style="color:#6b7280;font-size:16px;line-height:1.8;margin:0 0 36px;">
        Your food donation request has been <strong style="color:#059669;">accepted</strong> by our partner NGO. A volunteer has been assigned and will be there at the scheduled pickup time.
      </p>

      <!-- Details card -->
      <div style="background:#f9fafb;border-radius:16px;padding:28px;margin-bottom:28px;border:1px solid #e5e7eb;">
        <p style="color:#9ca3af;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Donation Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
              <span style="color:#6b7280;font-size:13px;font-weight:600;">Food Item</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;">
              <span style="color:#111827;font-size:14px;font-weight:800;">${foodDetails}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;">
              <span style="color:#6b7280;font-size:13px;font-weight:600;">Status</span>
            </td>
            <td style="padding:10px 0;text-align:right;">
              <span style="background:#ecfdf5;color:#059669;font-size:12px;font-weight:800;padding:4px 12px;border-radius:100px;">Accepted ✓</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Volunteer card -->
      <div style="background:linear-gradient(135deg,#ecfdf5 0%,#f0fdfa 100%);border-radius:16px;padding:28px;border:1px solid #a7f3d0;">
        <p style="color:#065f46;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Assigned Volunteer</p>
        <p style="color:#111827;font-size:20px;font-weight:900;margin:0 0 6px;">🚗 ${volunteerName}</p>
        <p style="color:#059669;font-size:15px;font-weight:700;margin:0;">📞 ${volunteerPhone}</p>
        <p style="color:#6b7280;font-size:13px;margin:10px 0 0;line-height:1.6;">They will contact you before pickup. Please keep your phone reachable.</p>
      </div>
    `),

  completed: ({ name, foodDetails }) =>
    baseTemplate(`
      <div style="text-align:center;margin-bottom:40px;">
        <div style="width:90px;height:90px;background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:40px;border:3px solid #6ee7b7;">
          🎊
        </div>
      </div>

      <h2 style="color:#111827;font-size:28px;font-weight:900;text-align:center;margin:0 0 16px;line-height:1.3;">
        Mission Accomplished, ${name}!
      </h2>
      <p style="color:#6b7280;font-size:16px;line-height:1.8;text-align:center;margin:0 0 40px;">
        Your donation of <strong style="color:#111827;">"${foodDetails}"</strong> has been <strong style="color:#059669;">successfully delivered</strong> to the NGO and is now feeding those in need.
      </p>

      <!-- Impact card -->
      <div style="background:linear-gradient(135deg,#064e3b 0%,#0d9488 100%);border-radius:20px;padding:36px;text-align:center;margin-bottom:32px;">
        <p style="color:#6ee7b7;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Your Impact Today</p>
        <p style="color:#ffffff;font-size:42px;font-weight:900;margin:0 0 8px;">+10 🌟</p>
        <p style="color:#a7f3d0;font-size:14px;font-weight:600;margin:0;">Impact Points Earned</p>
      </div>

      <div style="background:#f9fafb;border-radius:16px;padding:24px;border:1px solid #e5e7eb;">
        <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0;text-align:center;">
          "The greatest gift you can give someone is your time, your attention, your love, and your concern."<br>
          <span style="color:#9ca3af;font-size:13px;">— Joel Osteen</span>
        </p>
      </div>
    `),

  rejected: ({ name, foodDetails }) =>
    baseTemplate(`
      <div style="text-align:center;margin-bottom:36px;">
        <div style="display:inline-block;background:#fff7ed;border:2px solid #fed7aa;border-radius:100px;padding:10px 28px;">
          <span style="color:#c2410c;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Request Update</span>
        </div>
      </div>

      <h2 style="color:#111827;font-size:26px;font-weight:900;margin:0 0 14px;line-height:1.3;">
        Hi ${name}, a quick update on your request.
      </h2>
      <p style="color:#6b7280;font-size:16px;line-height:1.8;margin:0 0 32px;">
        Unfortunately, your donation request for <strong style="color:#111827;">"${foodDetails}"</strong> could not be accommodated at this time by the assigned NGO. This may be due to capacity or logistics constraints.
      </p>

      <div style="background:#fff7ed;border-radius:16px;padding:28px;margin-bottom:32px;border:1px solid #fed7aa;">
        <p style="color:#9a3412;font-size:14px;font-weight:700;margin:0 0 12px;">What can you do?</p>
        <ul style="color:#6b7280;font-size:14px;line-height:2;margin:0;padding-left:20px;">
          <li>Try submitting a new donation request</li>
          <li>Check if another NGO is available in your pincode</li>
          <li>Consider a smaller batch that's easier to transport</li>
        </ul>
      </div>

      <p style="color:#6b7280;font-size:15px;line-height:1.8;margin:0;">
        We truly appreciate your generosity and hope to connect you with an NGO very soon. Your willingness to share makes all the difference. 💚
      </p>
    `),
};

export const sendEmail = async ({ to, subject, html }) => {
  console.log(`[Email] Sending → ${to} | ${subject}`);

  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("[Email] SMTP credentials missing — skipping.");
    return;
  }
  if (!to) {
    console.warn("[Email] No recipient — skipping.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
    });
    const info = await transporter.sendMail({
      from: `FoodBridge <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent ✓ messageId: ${info.messageId}`);
  } catch (err) {
    console.error(`[Email] Failed → ${to}:`, err.message);
  }
};
