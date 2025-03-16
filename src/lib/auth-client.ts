import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const client = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL, // ✅ Vérifie que cette variable est bien définie dans `.env.local`
  fetchOptions: {
    onError(e) {
      if (e.error?.status === 429) { // ✅ Vérifie bien que `e.error` existe avant d'accéder à `status`
        toast.error("Trop de requêtes. Réessayez plus tard.");
      } else {
        toast.error("Une erreur est survenue.");
      }
    },
  },
});

export const { signUp, signIn, signOut, useSession } = client;

