"use client";

import SignInForm from "@/components/SignInForm";
import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const dashboardURL = "/dashboard";

  const signIn = async (formData: { email: string; password: string; rememberMe: boolean }) => {
    const { email, password, rememberMe } = formData;

    if (!email || !email.includes("@")) {
      toast.error("❌ L'email est invalide.");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("❌ Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    try {
      const { data, error } = await client.signIn.email(
        { email, password, callbackURL: dashboardURL, rememberMe },
        {
          onRequest: () => {
            toast("⏳ Connexion en cours...");
          },
          onSuccess: () => {
            toast.success("✅ Connexion réussie !");
            router.push(dashboardURL);
          },
          onError: (ctx) => {
            console.error("❌ Détails de l'erreur BetterAuth :", ctx.error.details);
            toast.error("❌ Erreur de connexion : " + ctx.error.message);
          },
        }
      );

      if (error) {
        console.error("📌 Erreur complète BetterAuth :", JSON.stringify(error, null, 2));
        toast.error("❌ Échec de la connexion : " + error.message);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error("❌ Erreur inattendue :", err);
      toast.error("❌ Une erreur inattendue est survenue.");
      return { data: null, error: err };
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <SignInForm onSubmit={signIn} />
      
      <p className="mt-4 text-gray-700">
        Pas encore de compte ?{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          Sinscrire ici
        </Link>
      </p>
    </div>
  );
}
