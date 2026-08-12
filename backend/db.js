import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Veritabanı dosyası yolu
const dbPath = path.join(__dirname, 'users.db');

// Veritabanı bağlantısı
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err.message);
    } else {
        console.log('✅ SQLite veritabanına bağlanıldı.');
        
        // Users tablosunu oluştur
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_verified INTEGER DEFAULT 0,
                verification_code TEXT,
                reset_token TEXT
            )
        `;
        
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Tablo oluşturma hatası:', err.message);
            } else {
                console.log('✅ Users tablosu hazır.');
            }
        });
    }
});

// Callback tabanlı SQL fonksiyonlarını Promise'a çeviren yardımcılar
export const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

export const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export default db;
