"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function CalendarAdmin() {
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  const fetchOccupiedDates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/occupied-dates");
      const data = await response.json();
      const dates = data.dates.map((dateStr: string) => new Date(dateStr));
      setOccupiedDates(dates);
    } catch (error) {
      console.error("Erro ao buscar datas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOccupiedDates = async (dates: Date[]) => {
    try {
      setIsSaving(true);
      const dateStrings = dates.map((d) => d.toISOString().split("T")[0]);
      const response = await fetch("/api/occupied-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: dateStrings }),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Erro ao salvar datas:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  function toggleDate(date: Date) {
    const newDates = occupiedDates.filter(
      (d) => d.toDateString() !== date.toDateString(),
    );
    if (newDates.length === occupiedDates.length) {
      newDates.push(date);
    }
    setOccupiedDates(newDates);
  }

  const handleSave = () => {
    saveOccupiedDates(occupiedDates);
  };

  if (isLoading) {
    return <div className="max-w-md mx-auto p-4">Carregando dados...</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="mb-4">
        Clique em um dia para marcar ou desmarcar como ocupado.
      </p>
      <Calendar
        mode="multiple"
        selected={occupiedDates}
        onDayClick={toggleDate}
        modifiers={{ occupied: occupiedDates }}
        modifiersClassNames={{ occupied: "bg-red-400 text-white" }}
      />
      <div className="mt-6 flex gap-2">
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
      {saveStatus === "success" && (
        <p className="mt-2 text-sm text-green-600">✓ Salvo com sucesso!</p>
      )}
      {saveStatus === "error" && (
        <p className="mt-2 text-sm text-red-600">✗ Erro ao salvar</p>
      )}
      <div className="mt-6">
        <h2 className="font-semibold mb-2">Dias ocupados:</h2>
        <ul className="list-disc ml-6">
          {occupiedDates.map((date) => (
            <li key={date.toISOString()}>{date.toLocaleDateString("pt-BR")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
