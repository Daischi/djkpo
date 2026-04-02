"use client";

import { useEffect, useState } from "react";
import AdminLogin from "./admin-login";
import CalendarAdmin from "@/components/contract/calendar-admin";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token no localStorage ao carregar
    const token = localStorage.getItem("adminToken");
    if (token === "authorized") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Administração de Datas Ocupadas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os dias disponíveis para agendamento
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
      <CalendarAdmin />
    </main>
  );
}
