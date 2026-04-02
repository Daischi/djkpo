import { Metadata } from "next";
import { ContractForm } from "@/components/contract/contract-form";
import { Music, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CalendarClient from "@/components/contract/calendar-client";

export const metadata: Metadata = {
  title: "Assinar Contrato | DJ KPO",
  description:
    "Preencha os dados e assine o contrato para formalizar a contratação do DJ KPO",
};

export default function ContratoPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Voltar ao site</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-black tracking-wider"
            >
              <Music className="w-6 h-6 text-primary" />
              <span className="text-foreground">DJ</span>
              <span className="text-primary">KPO</span>
            </Link>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Assinar <span className="text-primary">Contrato</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha os dados abaixo para formalizar a contratação do DJ. Após o
            envio, você receberá uma cópia do contrato por email.
          </p>
        </div>

        {/* Value Info */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-10 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">
                Valor do Serviço
              </p>
              <p className="text-3xl font-black text-primary">R$ 4.000,00</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-1">Agendamento</p>
              <div className="flex justify-center md:justify-end">
                {/* Calendário de agendamento */}
                <div className="max-w-xs w-full">
                  <CalendarClient />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Form */}
        <ContractForm />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>DJ KPO - Frequency Control | Techno / Industrial / Underground</p>
          <p className="mt-2">Todos os direitos reservados</p>
        </div>
      </footer>
    </main>
  );
}
