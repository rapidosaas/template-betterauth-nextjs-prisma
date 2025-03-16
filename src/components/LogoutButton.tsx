"use client";

import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const signOut = async () => {
    await client.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh(); // ✅ Rafraîchir la page après déconnexion
          router.push("/sign-in"); // ✅ Rediriger vers login après logout
        },
        onError: (ctx) => {
          alert(ctx.error.message);
        },
      },
    });
  };

  return (
    <button
      onClick={signOut}
      className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
    >
      Se déconnecter
    </button>
  );
}
