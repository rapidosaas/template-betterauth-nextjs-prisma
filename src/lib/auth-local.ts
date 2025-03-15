import { betterAuth } from "better-auth";
import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }),
});