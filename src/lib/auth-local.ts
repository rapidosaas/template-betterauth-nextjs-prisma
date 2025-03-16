import { betterAuth } from "better-auth";
import { Pool } from "pg";
import dotenv from "dotenv";
import { nextCookies } from "better-auth/next-js";
import { cache } from "react";
import { headers } from "next/headers";

dotenv.config(); // Charger les variables d'environnement

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins: [nextCookies()],
});

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
