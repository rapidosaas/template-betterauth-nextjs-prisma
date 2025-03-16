"use client";

import SignUpForm from "@/components/SignUpForm";

import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const dashboardURL = "/dashboard";

  const signUp = async (formData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { name, email, password } = formData;

    if (!name || name.trim().length < 2) {
      toast.error("❌ Le nom est trop court.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("❌ L'email est invalide.");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("❌ Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    try {
      const { data, error } = await client.signUp.email(formData, {
        callbackURL: dashboardURL,
        onRequest: () => {
          toast("⏳ Inscription en cours...");
        },
        onSuccess: () => {
          toast.success("✅ Inscription réussie !");
          router.push(dashboardURL);
        },
        onError: (ctx) => {
          console.error(
            "❌ Détails de l'erreur BetterAuth :",
            ctx.error.details
          ); // ✅ Affiche les détails d'erreur
          toast.error("❌ Erreur d'inscription : " + ctx.error.message);
        },
      });
      if (error) {
        console.error(
          "📌 Erreur complète BetterAuth :",
          JSON.stringify(error, null, 2)
        );
        toast.error("❌ Échec de l'inscription : " + error.message);
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
        <SignUpForm onSubmit={signUp} />
        
        <p className="mt-4 text-gray-700">
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    );
}
