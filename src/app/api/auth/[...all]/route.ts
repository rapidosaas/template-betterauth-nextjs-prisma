import { toNextJsHandler } from "better-auth/next-js";

/*import { auth as localAuth } from "@/lib/auth-local";
export const { GET, POST } = toNextJsHandler(localAuth.handler);*/

import { auth as prodAuth } from "@/lib/auth-prod";
export const { GET, POST } = toNextJsHandler(prodAuth.handler);