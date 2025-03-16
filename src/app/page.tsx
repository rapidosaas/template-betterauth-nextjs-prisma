"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold mb-6 text-gray-900">Bienvenue sur ce Template Next.JS Better-Auth Prisma</h1>
      <p className="text-lg text-gray-700 mb-8">Connectez-vous ou créez un compte pour accéder à votre espace.</p>

      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}