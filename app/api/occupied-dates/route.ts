import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "occupied-dates.json");

// Garantir que o arquivo existe
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ dates: [] }, null, 2));
  }
}

// Ler datas ocupadas
function getOccupiedDates(): string[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  const parsed = JSON.parse(data);
  return parsed.dates || [];
}

// Salvar datas ocupadas
function saveOccupiedDates(dates: string[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ dates }, null, 2));
}

export async function GET() {
  try {
    const dates = getOccupiedDates();
    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Erro ao ler datas:", error);
    return NextResponse.json({ dates: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dates } = body;

    if (!Array.isArray(dates)) {
      return NextResponse.json(
        { error: "dates deve ser um array" },
        { status: 400 },
      );
    }

    saveOccupiedDates(dates);
    return NextResponse.json({ success: true, dates });
  } catch (error) {
    console.error("Erro ao salvar datas:", error);
    return NextResponse.json(
      { error: "Erro ao salvar datas" },
      { status: 500 },
    );
  }
}
