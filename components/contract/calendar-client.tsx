"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarClient() {
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOccupiedDates();
  }, []);

  const fetchOccupiedDates = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-xs mx-auto p-4">Carregando calendário...</div>;
  }

  return (
    <div className="max-w-xs">
      <Calendar
        mode="single"
        disabled={occupiedDates}
        modifiers={{ occupied: occupiedDates }}
        modifiersClassNames={{ occupied: "bg-red-400 text-white" }}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Dias em vermelho estão ocupados e não podem ser agendados.
      </p>
    </div>
  );
}
