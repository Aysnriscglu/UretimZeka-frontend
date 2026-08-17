# Opex Dijital - ÜretimZeka Platformu

Bu proje, Yalın Üretim (Lean Manufacturing), Sürekli İyileştirme (Kaizen) ve OPEX süreçlerini hızlandırmak amacıyla yapay zeka destekli bir analiz platformu olarak geliştirilmiştir.

## 🚀 Proje Mimarisi
Proje tam teşekküllü bir **MERN** (React & Node.js) mimarisi üzerine kurulmuştur:
- **Frontend (Ön Yüz):** React, Vite, TypeScript, TailwindCSS
- **Backend (Arka Yüz):** Node.js, Express.js
- **Veritabanı:** PostgreSQL (Yerel testler için SQLite desteği mevcuttur)
- **Kimlik Doğrulama:** JWT (JSON Web Tokens)
- **E-posta Servisi:** EmailJS üzerinden SMTP entegrasyonu (Kullanıcı doğrulama ve şifre sıfırlama)

## 📦 Kurulum ve Çalıştırma

Projeyi Jantsa sunucularında veya yerel makinenizde çalıştırmak için iki farklı yöntem (Docker veya Manuel) kullanabilirsiniz.

### Yöntem 1: Docker ile Kurulum (Önerilen)
Projede hazır bir `Dockerfile` bulunmaktadır. Docker kurulu herhangi bir sunucuda projeyi tek tıkla ayağa kaldırabilirsiniz.

1. Proje dizininde Docker imajını oluşturun:
   ```bash
   docker build -t opex-dijital .
   ```
2. Konteyneri başlatın:
   ```bash
   docker run -p 5000:5000 --env-file .env opex-dijital
   ```
3. Tarayıcınızdan `http://localhost:5000` adresine giderek sistemi kullanmaya başlayabilirsiniz.

### Yöntem 2: Manuel Kurulum (Geliştirici Modu)
Eğer projeyi geliştirmek veya Docker olmadan çalıştırmak isterseniz:

1. Gerekli kütüphaneleri yükleyin:
   ```bash
   npm install
   cd backend && npm install
   cd ..
   ```
2. Ana dizinde bulunan `.env.example` dosyasının adını `.env` olarak değiştirin ve içindeki şifreleri/veritabanı bilgilerinizi kendi sunucunuza göre doldurun.
3. Projeyi derleyin ve başlatın:
   ```bash
   npm run build
   cd backend && npm start
   ```

## 🔐 Ortam Değişkenleri (.env)
Projenin çalışması için kök dizinde bir `.env` dosyası bulunmalıdır. Gerekli anahtarlar `.env.example` dosyasında belirtilmiştir:
- `DATABASE_URL`: PostgreSQL bağlantı dizesi
- `JWT_SECRET`: Güvenlik için kullanılacak rastgele bir metin
- `EMAILJS_*`: Maillerin gönderilmesi için EmailJS API anahtarları

## 👥 Yönetici (Admin) Paneli
Uygulamaya kayıt olup giriş yaptıktan sonra, tarayıcı URL'sinin sonuna `/admin` ekleyerek (veya arayüzdeki butona tıklayarak) yönetici paneline erişebilirsiniz. Bu panel üzerinden sistemdeki tüm kullanıcıları görüntüleyebilir ve yönetebilirsiniz.
