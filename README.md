# JANTSA - Opex Dijital Yapay Zeka Platformu
## Teknik Devir Teslim ve BT Yönetim Kılavuzu 🚀

Bu doküman, Jantsa Opex Dijital projesinin kaynak kodlarının yönetimi, güncellenmesi ve canlı sunucularda (production) nasıl yayınlanacağını BT (IT) ekibine aktarmak amacıyla hazırlanmıştır.

Proje, modern yazılım prensipleri (CI/CD, Git, MERN Stack) kullanılarak **tam otomatik** çalışacak şekilde tasarlanmıştır.

---

### 1. Sistemin Çalışma Mantığı (Mimari)
Proje, sunuculara eski usul dosya kopyalama (FTP vb.) yöntemiyle **YÜKLENMEZ**. Tüm sistem **GitHub** üzerinden otonom bir şekilde çalışır.

* **Frontend (Önyüz):** React, Vite, TailwindCSS (Vercel sunucularında barındırılır)
* **Backend (Arkayüz):** Node.js, Express.js (Railway sunucularında barındırılır)
* **Veritabanı:** PostgreSQL (Railway üzerinde)
* **Otomasyon (CI/CD):** Siz kodları GitHub'a gönderdiğiniz anda (Push), Vercel ve Railway bunu algılar ve siteyi otomatik olarak günceller. Sunucuya girip ayar yapmanıza gerek yoktur.

---

### 2. Projeyi Bilgisayara İndirme ve Çalıştırma (Lokal Test)
Kodlarda bir renk, yazı veya özellik değiştirmek isterseniz önce bunu kendi bilgisayarınızda (Lokalde) test etmelisiniz.

**Adım 1:** GitHub reposunu bilgisayarınıza indirin (VS Code kullanmanız önerilir):
```bash
git clone https://github.com/Aysnriscglu/UretimZeka-frontend.git
```

**Adım 2:** İndirdiğiniz klasörün içine girin ve gerekli kütüphaneleri (paketleri) yükleyin:
```bash
cd UretimZeka-frontend
npm install
cd backend && npm install
cd ..
```

**Adım 3:** Projeyi kendi bilgisayarınızda başlatın:
```bash
npm run dev
```
*(Bu komutu yazdığınızda sistem `localhost:5173` adresinde açılacaktır. Kodlarda yaptığınız her değişiklik anında tarayıcıya yansır).*

---

### 3. Kodlarda Değişiklik Yapma ve Canlıya Alma (Git Workflow)
Kendi bilgisayarınızda değişiklikleri yaptınız, her şey kusursuz çalışıyor. Peki bunu şirketin canlı web sitesine nasıl aktaracaksınız? Sadece **3 basit Git komutu** ile:

VS Code Terminalini açın ve sırasıyla şu komutları yazın:

**1. Değişiklikleri Hazırla:**
```bash
git add .
```

**2. Ne Değişiklik Yaptığınızı Not Edin (Commit):**
```bash
git commit -m "Ana sayfadaki Jantsa logosu büyütüldü ve mavi renk yapıldı"
```

**3. GitHub'a Gönder (Canlıya Al):**
```bash
git push
```

**🎉 SİHİR BURADA BAŞLIYOR!**
Siz `git push` komutunu girdiğiniz an, kodlar GitHub'a ulaşır. Vercel ve Railway sunucuları yeni kod geldiğini otomatik olarak algılar ve **1 dakika içinde** sitenin canlı halini günceller. IT ekibinin sunucuyu kapatıp açmasına veya dosya yüklemesine gerek yoktur.

---

### 4. Klasör Yapısı (Neyi Nerede Bulacaksınız?)
Eğer kodlarda bir şey arıyorsanız, işte haritanız:

* `src/pages/` ➡️ Sitenin sayfaları (AI.tsx, Dashboard.tsx, Login.tsx) burada bulunur.
* `src/components/` ➡️ Sitedeki butonlar, kartlar, menüler burada yer alır.
* `src/index.css` ➡️ Sitenin ana tasarım (CSS/Tailwind) ayarları.
* `backend/server.js` ➡️ Arka plan işlemleri, Veritabanı bağlantısı, Yapay Zeka (Groq API) haberleşmesi buradadır.

---

### 5. Kritik Servisler ve Anahtarlar (.env)
Projenin çalışması için bazı gizli anahtarlara ihtiyaç vardır (Yapay zeka şifresi, Mail şifresi vb.). Bu şifreler asla GitHub'a yüklenmez. Vercel ve Railway panellerindeki **Environment Variables (.env)** kısmına eklenmiştir:
* `GROQ_API_KEY`: Yapay Zekanın çalışması için gereken anahtar.
* `EMAILJS_SERVICE_ID`: Doğrulama e-postalarının (Şifremi unuttum vb.) gönderilmesi için.
* `DATABASE_URL`: PostgreSQL veritabanı bağlantı adresi.

*Devir teslim sürecini tamamlayan ve mimariyi kuran: Ayşenur İşcioğlu (2026)*
