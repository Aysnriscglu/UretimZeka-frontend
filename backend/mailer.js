const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "service_tdstkw3";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "template_7qclhuf";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "0Lf2cOAhgDMm17wpu";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || "O1vM3f388OioXebFzBon_";

const sendEmailJSEmail = async (to_email, subject, html_message) => {
    try {
        const payload = {
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            accessToken: EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email,
                subject,
                html_message
            }
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log(`📧 EmailJS ile ${subject} başarıyla gönderildi: ${to_email}`);
            return true;
        } else {
            const errorText = await response.text();
            console.error("EmailJS API Hatası:", errorText);
            return false;
        }
    } catch (err) {
        console.error("EmailJS gönderim hatası:", err);
        return false;
    }
};

export const sendVerificationEmail = async (to, token, frontendUrl) => {
    const link = `${frontendUrl}/verify-email?token=${token}`;
    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; border: 1px solid #e2e8f0;">
      <div style="margin-bottom: 30px;">
        <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Opex Dijital</h1>
      </div>
      <h2 style="color: #334155; font-size: 22px; margin-bottom: 15px; font-weight: 600;">Aramıza Hoş Geldiniz!</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Hesabınızı güvenle kullanmaya başlamak için e-posta adresinizi doğrulamanız gerekmektedir. Lütfen aşağıdaki butona tıklayarak işleminizi tamamlayın.</p>
      <a href="${link}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">Hesabımı Onaylıyorum</a>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Eğer butona tıklayamıyorsanız, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:<br/>
        <a href="${link}" style="color: #38bdf8; word-break: break-all;">${link}</a></p>
      </div>
    </div>
    `;

    return await sendEmailJSEmail(to, "Hesap Onay Linki", htmlContent);
};

export const sendPasswordResetEmail = async (to, resetToken, frontendUrl) => {
    const link = `${frontendUrl}/reset-password?token=${resetToken}`;
    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; border: 1px solid #e2e8f0;">
      <div style="margin-bottom: 30px;">
        <h1 style="color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Opex Dijital</h1>
      </div>
      <h2 style="color: #334155; font-size: 22px; margin-bottom: 15px; font-weight: 600;">Şifre Sıfırlama Talebi</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Hesabınız için bir şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayabilirsiniz. Eğer bu talebi siz yapmadıysanız bu e-postayı dikkate almayınız.</p>
      <a href="${link}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">Yeni Şifre Belirle</a>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0;">Eğer butona tıklayamıyorsanız, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:<br/>
        <a href="${link}" style="color: #f87171; word-break: break-all;">${link}</a></p>
      </div>
    </div>
    `;

    return await sendEmailJSEmail(to, "Şifre Sıfırlama Talebi", htmlContent);
};
