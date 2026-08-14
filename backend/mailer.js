import nodemailer from 'nodemailer';

let transporter;

const initializeMailer = async () => {
    try {
        if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
            transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
            console.log("✅ Mailer (Gmail) hazır. Kullanıcı:", process.env.GMAIL_USER);
        } else {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log("✅ Mailer (Ethereal) hazır. Test hesabı:", testAccount.user);
        }
    } catch (err) {
        console.error("Mailer başlatılamadı:", err);
    }
};

// Asenkron başlatıyoruz, uygulama açılırken hazır olacak
initializeMailer();

export const sendVerificationEmail = async (to, token, frontendUrl) => {
    if (!transporter) return;
    try {
        const link = `${frontendUrl}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
            from: '"Opex Dijital" <test@opexdijital.com>',
            to: to,
            subject: "Hesap Onay Linki",
            text: `Opex Dijital'e hoş geldiniz! Hesabınızı onaylamak için tıklayın: ${link}`,
            html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h2>Opex Dijital'e Hoş Geldiniz!</h2>
              <p>Hesabınızı güvenle kullanmaya başlamak için lütfen aşağıdaki butona tıklayarak onaylayın.</p>
              <a href="${link}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #0284c7; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Hesabımı Onaylıyorum</a>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">Eğer butona tıklayamıyorsanız, şu linki kopyalayıp tarayıcınıza yapıştırın:<br/>${link}</p>
            </div>
            `,
        });
        console.log("📧 Doğrulama Linki Gönderildi! Test URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (err) {
        console.error("E-posta gönderim hatası:", err);
    }
};

export const sendPasswordResetEmail = async (to, resetToken, frontendUrl) => {
    if (!transporter) return;
    try {
        const link = `${frontendUrl}/reset-password?token=${resetToken}`;
        const info = await transporter.sendMail({
            from: '"Opex Dijital" <test@opexdijital.com>',
            to: to,
            subject: "Şifre Sıfırlama Talebi",
            text: `Şifrenizi sıfırlamak için tıklayın: ${link}`,
            html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
              <h2>Şifre Sıfırlama Talebi</h2>
              <p>Şifrenizi yenilemek için aşağıdaki butona tıklayın.</p>
              <a href="${link}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Yeni Şifre Belirle</a>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">Eğer butona tıklayamıyorsanız, şu linki kopyalayıp tarayıcınıza yapıştırın:<br/>${link}</p>
            </div>
            `,
        });
        console.log("📧 Şifre Sıfırlama Linki Gönderildi! Test URL: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (err) {
        console.error("E-posta gönderim hatası:", err);
    }
};
