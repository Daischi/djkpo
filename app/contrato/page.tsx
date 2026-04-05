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

        {/* Agenda Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-primary/20">
            {/* Glow de fundo */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-stretch">
              {/* Foto DJ KPO */}
              <div className="md:w-56 flex-shrink-0 relative overflow-hidden">
                <img
                  src="/dj-kpo-agenda.jpg"
                  alt="DJ KPO"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: "360px" }}
                />
                {/* Gradiente lateral para fundir com o calendário */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 hidden md:block" />
                {/* Gradiente inferior no mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 md:hidden" />
              </div>

              {/* Calendário */}
              <div className="flex-1 pl-6 pr-8 py-8 flex flex-col justify-center bg-black/40 backdrop-blur-sm">
                {/* Header */}
                <div className="mb-6">
                  <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.4em] mb-2 border border-primary/30 px-3 py-1 rounded-full bg-primary/5">
                    Disponibilidade
                  </span>
                  <h3 className="text-2xl font-black text-foreground mt-3">
                    Agenda do{" "}
                    <span className="text-primary relative">
                      DJ KPO
                      <span className="absolute -inset-1 blur-md bg-primary/20 -z-10" />
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verifique a disponibilidade antes de prosseguir
                  </p>
                </div>

                {/* Separador */}
                <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent mb-6" />

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Calendário */}
                  <div className="flex-shrink-0">
                    <CalendarClient />
                  </div>

                  {/* Info lateral */}
                  <div className="flex flex-col gap-3 w-full">
                    {/* Gêneros */}
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                      <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
                        Estilos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Techno",
                          "Industrial",
                          "Underground",
                          "Dark Techno",
                        ].map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-primary">+100</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                          Events
                        </p>
                      </div>
                      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-center">
                        <p className="text-2xl font-black text-primary">+5h</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-wider">
                          Set médio
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-1">
                        Próximo passo
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        Escolha uma data disponível e preencha o formulário
                        abaixo para formalizar a contratação.
                      </p>
                    </div>
                  </div>
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
