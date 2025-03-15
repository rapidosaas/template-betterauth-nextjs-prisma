import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        const res = await client.query("SELECT NOW()");
        console.log("✅ Connexion réussie à PostgreSQL (LOCAL) - Date serveur :", res.rows[0].now);
        client.release();
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL (LOCAL) :", error);
    } finally {
        await pool.end();
    }
}

testConnection();
