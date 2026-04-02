"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validação de senha usando variável de ambiente
    const correctPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (password === correctPassword) {
      // Salvar token no localStorage
      localStorage.setItem("adminToken", "authorized");
      setPassword("");
      onLoginSuccess();
    } else {
      setError("Senha incorreta");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 border border-border rounded-lg bg-card shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Admin</h1>
          <p className="text-muted-foreground">Digite a senha para acessar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="bg-background"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Área restrita ao administrador
        </p>
      </div>
    </div>
  );
}
