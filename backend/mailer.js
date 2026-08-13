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

export const sendVerificationEmail = async (to, code) => {
    if (!transporter) return;
    try {
        const info = await transporter.sendMail({
            from: '"Opex Dijital Test" <test@opexdijital.com>',
            to: to,
            subject: "Hesap Onay Kodu",
            text: `Opex Dijital'e hoş geldiniz! Onay Kodunuz: ${code}`,
            html: `<h3>Opex Dijital'e hoş geldiniz!</h3><p>Hesabınızı onaylamak için doğrulama kodunuz:</p><h2>${code}</h2>`,
        });
        console.log("📧 Doğrulama E-postası gönderildi! Link: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (err) {
        console.error("E-posta gönderim hatası:", err);
    }
};

export const sendPasswordResetEmail = async (to, resetToken) => {
    if (!transporter) return;
    try {
        const info = await transporter.sendMail({
            from: '"Opex Dijital Test" <test@opexdijital.com>',
            to: to,
            subject: "Şifre Sıfırlama Talebi",
            text: `Şifrenizi sıfırlamak için bu kodu kullanın: ${resetToken}`,
            html: `<h3>Şifre Sıfırlama Talebi</h3><p>Şifrenizi yenilemek için doğrulama kodunuz:</p><h2>${resetToken}</h2>`,
        });
        console.log("📧 Şifre Sıfırlama E-postası gönderildi! Link: %s", nodemailer.getTestMessageUrl(info));
        return info;
    } catch (err) {
        console.error("E-posta gönderim hatası:", err);
    }
};
