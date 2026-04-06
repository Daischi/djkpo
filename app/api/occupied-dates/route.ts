import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REDIS_KEY = "occupied-dates";
const DATA_FILE = path.join(process.cwd(), "public", "occupied-dates.json");
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// --- Upstash Redis (produção) ---
async function getRedisClient() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

async function getOccupiedDatesRedis(): Promise<string[]> {
  const redis = await getRedisClient();
  const dates = await redis.get<string[]>(REDIS_KEY);
  return dates || [];
}

async function saveOccupiedDatesRedis(dates: string[]): Promise<void> {
  const redis = await getRedisClient();
  await redis.set(REDIS_KEY, dates);
}

// --- Arquivo local (desenvolvimento) ---
function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ dates: [] }, null, 2));
  }
}

function getOccupiedDatesLocal(): string[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  const parsed = JSON.parse(data);
  return parsed.dates || [];
}

function saveOccupiedDatesLocal(dates: string[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ dates }, null, 2));
}

export async function GET() {
  try {
    const dates = IS_PRODUCTION
      ? await getOccupiedDatesRedis()
      : getOccupiedDatesLocal();
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

    if (IS_PRODUCTION) {
      await saveOccupiedDatesRedis(dates);
    } else {
      saveOccupiedDatesLocal(dates);
    }

    return NextResponse.json({ success: true, dates });
  } catch (error) {
    console.error("Erro ao salvar datas:", error);
    return NextResponse.json(
      { error: "Erro ao salvar datas" },
      { status: 500 },
    );
  }
}
