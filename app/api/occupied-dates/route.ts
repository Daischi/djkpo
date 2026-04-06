import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const REDIS_KEY = "occupied-dates";
const DATA_FILE = path.join(process.cwd(), "public", "occupied-dates.json");

const hasRedis =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// --- Arquivo local (desenvolvimento) ---
function getOccupiedDatesLocal(): string[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data).dates || [];
}

function saveOccupiedDatesLocal(dates: string[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ dates }, null, 2));
}

export async function GET() {
  try {
    if (hasRedis) {
      const redis = getRedis();
      const raw = await redis.get(REDIS_KEY);
      let dates: string[] = [];
      if (Array.isArray(raw)) {
        dates = raw as string[];
      } else if (typeof raw === "string") {
        dates = JSON.parse(raw);
      }
      return NextResponse.json({ dates });
    }

    return NextResponse.json({ dates: getOccupiedDatesLocal() });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Erro ao ler datas:", message);
    return NextResponse.json({ dates: [], error: message }, { status: 500 });
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

    if (hasRedis) {
      const redis = getRedis();
      await redis.set(REDIS_KEY, JSON.stringify(dates));
    } else {
      saveOccupiedDatesLocal(dates);
    }

    return NextResponse.json({ success: true, dates });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Erro ao salvar datas:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
