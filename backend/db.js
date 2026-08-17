import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usePostgres = !!process.env.DATABASE_URL;
let pool;
let sqliteDb;

if (usePostgres) {
    console.log('🔄 PostgreSQL bağlantısı başlatılıyor...');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_verified INTEGER DEFAULT 0,
            verification_code TEXT,
            reset_token TEXT,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until TIMESTAMP
        )
    `).then(() => console.log('✅ PostgreSQL Users tablosu hazır.'))
      .catch(err => console.error('PostgreSQL tablo oluşturma hatası:', err.message));

} else {
    console.log('🔄 SQLite bağlantısı başlatılıyor (Yerel mod)...');
    const dbPath = path.join(__dirname, 'users.db');
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Veritabanına bağlanılamadı:', err.message);
        } else {
            console.log('✅ SQLite veritabanına bağlanıldı.');
            sqliteDb.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    is_verified INTEGER DEFAULT 0,
                    verification_code TEXT,
                    reset_token TEXT,
                    failed_login_attempts INTEGER DEFAULT 0,
                    locked_until DATETIME
                )
            `, (err) => {
                if (err) console.error('Tablo oluşturma hatası:', err.message);
                else console.log('✅ SQLite Users tablosu hazır.');
            });
        }
    });
}

// SQL Sorgusundaki ? işaretlerini Postgres için $1, $2 formatına çevirir
const formatSql = (sql) => {
    if (!usePostgres) return sql;
    let result = sql;
    let i = 1;
    while (result.includes('?')) {
        result = result.replace('?', '$' + i++);
    }
    return result;
};

export const runAsync = async (sql, params = []) => {
    if (usePostgres) {
        return pool.query(formatSql(sql), params);
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }
};

export const getAsync = async (sql, params = []) => {
    if (usePostgres) {
        const res = await pool.query(formatSql(sql), params);
        return res.rows[0];
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

export const allAsync = async (sql, params = []) => {
    if (usePostgres) {
        const res = await pool.query(formatSql(sql), params);
        return res.rows;
    } else {
        return new Promise((resolve, reject) => {
            sqliteDb.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

export default usePostgres ? pool : sqliteDb;

