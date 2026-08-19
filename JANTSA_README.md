# 🚀 Jantsa Opex Dijital - Kurulum ve Devir Teslim Kılavuzu

Bu doküman, Jantsa BT (IT) ekibinin Opex Dijital platformunu kendi sunucularında veya bulut ortamında nasıl ayağa kaldırıp yöneteceğini anlatmaktadır.

## 🛠️ Kullanılan Teknolojiler (Tech Stack)
- **Frontend (Kullanıcı Arayüzü):** React.js, Vite, TailwindCSS, Material UI (MUI)
- **Backend (Sunucu):** Node.js, Express.js
- **Veritabanı (Database):** PostgreSQL (Geliştirme aşamasında SQLite destekli)
- **Güvenlik (Security):** Bcrypt (Şifreleme), JWT (Oturum Yönetimi), Helmet (XSS), Express Rate Limit (DDoS Koruması)
- **Diğer Servisler:** Groq API (Yapay Zeka Analizleri), EmailJS (E-Posta Doğrulama)

---

## 🔐 1. Gerekli Çevre Değişkenleri (.env)
Projenin `backend` dizininde bir `.env` dosyası oluşturulmalı ve aşağıdaki değişkenler şirketinize ait bilgilerle doldurulmalıdır:

```env
# Uygulamanın çalışacağı ana link (CORS ve E-Posta yönlendirmeleri için zorunludur)
FRONTEND_URL=https://sirket_linkiniz.com 

# PostgreSQL Bağlantı Adresi (Boş bırakılırsa yerel SQLite 'users.db' dosyası oluşur)
DATABASE_URL=postgres://kullanici:sifre@sunucu:port/veritabani

# JWT Şifreleme Anahtarı (Oturum güvenlik kilidi)
JWT_SECRET=cok_guclu_bir_sifre_belirleyin_123!

# E-Posta Gönderim Ayarları (E-posta doğrulaması için)
GMAIL_USER=otomasyon@jantsa.com.tr
GMAIL_PASS=mail_sifreniz

# Yapay Zeka Kök Neden Analizi İçin (Opsiyonel)
GROQ_API_KEY=groq_hesabindan_alinan_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 💻 2. Kurulum Adımları (Installation)

Sistemi Node.js yüklü herhangi bir sunucuya (Linux/Windows) kurmak için aşağıdaki komutları terminalde sırasıyla çalıştırın:

```bash
# 1. Proje dizinine girin
cd UretimZeka/frontend

# 2. Frontend bağımlılıklarını yükleyin
npm install

# 3. Backend bağımlılıklarını yükleyin
cd backend
npm install
cd ..

# 4. Frontend kodunu canlı yayına hazır (production) hale getirin
npm run build

# 5. Sunucuyu başlatın
cd backend
node server.js
```

Sunucu çalıştığında `http://localhost:5000` adresinden (veya bağladığınız domain üzerinden) sisteme erişebilirsiniz.

---

## 🛡️ 3. Güvenlik Notları (Security Notes)
- Sistem, **saniyede/dakikada çok fazla giriş (Login) denemesi** yapıldığında IP adreslerini otomatik olarak **15 dakika banlayacak** şekilde (Brute Force Kalkanı) yapılandırılmıştır.
- Tüm veritabanı sorguları parametrik yapıldığı için **SQL Injection** ataklarına karşı kapalıdır.
- Kullanıcı şifreleri veritabanına açık metin (Plain Text) olarak **kesinlikle yazılmaz**, geri döndürülemez Bcrypt algoritmasıyla (Hash) şifrelenir.

*Hazırlayan: Ayşenur İscioğlu - Opex Dijital Yazılım Geliştiricisi*
