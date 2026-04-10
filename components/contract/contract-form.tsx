"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SignaturePad } from "./signature-pad";
import { ContractPreview } from "./contract-preview";
import { Spinner } from "@/components/ui/spinner";

const SERVICE_PRICING: Record<
  string,
  { basePrice: number; includedHours: number; hourlyOnly?: boolean }
> = {
  Casamento: { basePrice: 4000, includedHours: 6 },
  Aniversário: { basePrice: 1000, includedHours: 4 },
  "Evento Corporativo": { basePrice: 4000, includedHours: 4 },
  Festa: { basePrice: 2000, includedHours: 4 },
  Rave: { basePrice: 3000, includedHours: 6 },
  Festival: { basePrice: 2000, includedHours: 4 },
  Formatura: { basePrice: 2000, includedHours: 5 },
};

const ADDITIONAL_HOUR_PRICE = 500;

function calcEventHours(inicio: string, termino: string): number {
  if (!inicio || !termino) return 0;
  const [h1, m1] = inicio.split(":").map(Number);
  const [h2, m2] = termino.split(":").map(Number);
  let minutes = h2 * 60 + m2 - (h1 * 60 + m1);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes / 60;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcPricing(
  tipoEvento: string,
  horarioInicio: string,
  horarioTermino: string,
) {
  const config = SERVICE_PRICING[tipoEvento];
  if (!config) return null;
  const totalHours = calcEventHours(horarioInicio, horarioTermino);
  const additionalHours = Math.max(
    0,
    Math.ceil(totalHours - config.includedHours),
  );
  const additionalCost = additionalHours * ADDITIONAL_HOUR_PRICE;
  const total = config.basePrice + additionalCost;
  return { ...config, totalHours, additionalHours, additionalCost, total };
}

const eventTypes = [
  "Festa",
  "Casamento",
  "Aniversário",
  "Evento Corporativo",
  "Rave",
  "Festival",
  "Formatura",
  "Outro",
];

export function ContractForm() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    nomeEvento: "",
    tipoEvento: "",
    localEvento: "",
    dataEvento: null as Date | null,
    horarioInicio: "",
    horarioTermino: "",
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  const fetchOccupiedDates = async () => {
    try {
      setIsLoadingDates(true);
      const response = await fetch("/api/occupied-dates");
      const data = await response.json();
      const dates = data.dates.map((dateStr: string) => {
        // Parsear como horário local para evitar bug de timezone (UTC vs UTC-3)
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      });
      setOccupiedDates(dates);
    } catch (error) {
      console.error("Erro ao buscar datas ocupadas:", error);
    } finally {
      setIsLoadingDates(false);
    }
  };

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const validateForm = () => {
    if (!formData.nomeCompleto.trim()) return "Nome completo é obrigatório";
    if (!formData.cpf.trim() || formData.cpf.length < 14)
      return "CPF válido é obrigatório";
    if (!formData.email.trim() || !formData.email.includes("@"))
      return "Email válido é obrigatório";
    if (!formData.nomeEvento.trim()) return "Nome do evento é obrigatório";
    if (!formData.tipoEvento) return "Tipo do evento é obrigatório";
    if (!formData.localEvento.trim()) return "Local do evento é obrigatório";
    if (!formData.dataEvento) return "Data do evento é obrigatória";
    if (!formData.horarioInicio) return "Horário de início é obrigatório";
    if (!formData.horarioTermino) return "Horário de término é obrigatório";
    if (!signature) return "Assinatura é obrigatória";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dataEvento: formData.dataEvento?.toISOString(),
          signature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar contrato");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Erro ao enviar contrato:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar contrato",
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 bg-card rounded-xl border border-border max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            Contrato Assinado!
          </h2>
          <p className="text-muted-foreground">
            Uma cópia do contrato foi enviada para seu email:{" "}
            <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Em breve entraremos em contato para confirmar os detalhes do seu
            evento.
          </p>
          <Button
            onClick={() => {
              setSubmitStatus("idle");
              setFormData({
                nomeCompleto: "",
                cpf: "",
                email: "",
                nomeEvento: "",
                tipoEvento: "",
                localEvento: "",
                dataEvento: null,
                horarioInicio: "",
                horarioTermino: "",
              });
              setSignature(null);
            }}
            className="mt-4"
          >
            Criar Novo Contrato
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Dados Pessoais
            </h3>

            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) =>
                  handleInputChange("nomeCompleto", e.target.value)
                }
                placeholder="Seu nome completo"
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) =>
                    handleInputChange("cpf", formatCPF(e.target.value))
                  }
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Dados do Evento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeEvento">Nome do Evento</Label>
                <Input
                  id="nomeEvento"
                  value={formData.nomeEvento}
                  onChange={(e) =>
                    handleInputChange("nomeEvento", e.target.value)
                  }
                  placeholder="Ex: Festa de Aniversário"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoEvento">Tipo do Evento</Label>
                <Select
                  value={formData.tipoEvento}
                  onValueChange={(value) =>
                    handleInputChange("tipoEvento", value)
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localEvento">Local do Evento</Label>
              <Input
                id="localEvento"
                value={formData.localEvento}
                onChange={(e) =>
                  handleInputChange("localEvento", e.target.value)
                }
                placeholder="Endereço completo do evento"
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Data do Evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !formData.dataEvento && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataEvento ? (
                        format(formData.dataEvento, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Selecione</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dataEvento || undefined}
                      onSelect={(date) =>
                        handleInputChange("dataEvento", date || null)
                      }
                      disabled={(date) => {
                        const isPast = date < new Date();
                        const isOccupied = occupiedDates.some(
                          (occupied) =>
                            occupied.toDateString() === date.toDateString(),
                        );
                        return isPast || isOccupied;
                      }}
                      modifiers={{ occupied: occupiedDates }}
                      modifiersClassNames={{
                        occupied: "bg-red-400 text-white",
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioInicio">Horário Início</Label>
                <Input
                  id="horarioInicio"
                  type="time"
                  value={formData.horarioInicio}
                  onChange={(e) =>
                    handleInputChange("horarioInicio", e.target.value)
                  }
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horarioTermino">Horário Término</Label>
                <Input
                  id="horarioTermino"
                  type="time"
                  value={formData.horarioTermino}
                  onChange={(e) =>
                    handleInputChange("horarioTermino", e.target.value)
                  }
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          {(() => {
            if (!formData.tipoEvento) return null;
            if (formData.tipoEvento === "Outro") {
              return (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                    Resumo do Valor
                  </h3>
                  <div className="bg-background border border-border rounded-lg overflow-hidden text-sm">
                    <div className="flex justify-between items-center px-4 py-3 bg-primary/10 font-bold">
                      <span className="text-foreground">Valor</span>
                      <span className="text-primary text-lg">A combinar</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O valor será negociado diretamente entre as partes.
                  </p>
                </div>
              );
            }
            const pricing = calcPricing(
              formData.tipoEvento,
              formData.horarioInicio,
              formData.horarioTermino,
            );
            if (!pricing) return null;
            return (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Resumo do Valor
                </h3>
                <div className="bg-background border border-border rounded-lg overflow-hidden text-sm">
                  {!pricing.hourlyOnly && (
                    <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                      <span className="text-muted-foreground">
                        {formData.tipoEvento} — {pricing.includedHours}h
                        incluídas
                      </span>
                      <span>{formatBRL(pricing.basePrice)}</span>
                    </div>
                  )}
                  {pricing.additionalHours > 0 && (
                    <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                      <span className="text-muted-foreground">
                        {pricing.hourlyOnly
                          ? `${pricing.additionalHours}h × ${formatBRL(ADDITIONAL_HOUR_PRICE)}/h`
                          : `Horas adicionais (${pricing.additionalHours}h × ${formatBRL(ADDITIONAL_HOUR_PRICE)})`}
                      </span>
                      <span>{formatBRL(pricing.additionalCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center px-4 py-3 bg-primary/10 font-bold">
                    <span className="text-foreground">Total a Pagar</span>
                    <span className="text-primary text-lg">
                      {formatBRL(pricing.total)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {pricing.hourlyOnly
                    ? `${formatBRL(ADDITIONAL_HOUR_PRICE)}/h · Pagamento antecipado via Pix`
                    : `Hora adicional: ${formatBRL(ADDITIONAL_HOUR_PRICE)}/h · Pagamento antecipado via Pix`}
                </p>
              </div>
            );
          })()}

          {/* Signature */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              Assinatura
            </h3>
            <SignaturePad onSignatureChange={setSignature} />
          </div>

          {/* Error Message */}
          {submitStatus === "error" && errorMessage && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-5 h-5" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Assinar e Enviar Contrato
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Contract Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Visualização do Contrato
        </h3>
        <div className="max-h-[800px] overflow-y-auto rounded-xl border border-border">
          <ContractPreview data={formData} signature={signature} />
        </div>
      </div>
    </div>
  );
}
