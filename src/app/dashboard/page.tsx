import { getSession as getSessionLocal } from "@/lib/auth-local";
import { getSession as getSessionProd } from "@/lib/auth-prod";

const isLocalDB = process.env.DATABASE_URL?.includes("localhost");
const getSession = isLocalDB ? getSessionLocal : getSessionProd;

import Link from "next/link";
import UserProfile from "@/components/UserProfile";

export default async function DashboardPage() {
  const session = await getSession(); // ✅ Récupération directe de la session

  return (
    <main className="h-screen bg-gray-100 flex flex-col items-center justify-center">
      {session?.user ? (
        <>
          <UserProfile user={session.user} />
          <h1 className="text-3xl font-bold mt-6">Bienvenue, {session.user.name} 🎉</h1>
          <p className="text-lg text-gray-700 mt-2">Vous êtes connecté à votre tableau de bord.</p>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-700 mb-4">Vous devez être connecté pour accéder au dashboard.</p>
          <Link href="/sign-in">
            <button className="rounded-full bg-blue-500 text-white px-10 py-3 font-semibold transition hover:bg-blue-700">
              Se connecter
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
