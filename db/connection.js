const mariadb = require('mariadb');
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
    connectTimeout: 10000,
    ssl: {
        rejectUnauthorized: false 
    }
});

async function initDB() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`
            CREATE TABLE IF NOT EXISTS user_addresses (
                email VARCHAR(255) NOT NULL,
                address TEXT NOT NULL,
                PRIMARY KEY (email)
            )
        `);
        console.log("Database initialized: user_addresses table is ready.");
    } catch (err) {
        console.error("Failed to initialize database:", err);
    } finally {
        if (conn) conn.release();
    }
}

initDB();

module.exports = pool;