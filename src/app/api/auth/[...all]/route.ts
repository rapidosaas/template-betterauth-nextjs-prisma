import { auth as localAuth } from "@/lib/auth-local";
import { auth as prodAuth } from "@/lib/auth-prod";
import { toNextJsHandler } from "better-auth/next-js";

const isLocalDB = process.env.DATABASE_URL?.includes("localhost");
export const auth = isLocalDB ? localAuth : prodAuth;

export const { GET, POST } = toNextJsHandler(auth);