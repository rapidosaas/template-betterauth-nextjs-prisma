"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface SignInFormProps {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void;
}

export default function SignInForm({ onSubmit }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await onSubmit({ email, password, rememberMe });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold text-center mb-4">Se connecter</h2>

      <Input
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Mot de passe"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="mb-4 flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="rememberMe" className="text-gray-700 text-sm">
          Se souvenir de moi
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
}
