export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  const setting = await prisma.setting.findUnique({ where: { key } });
  return NextResponse.json({ value: setting?.value ?? "" });
}

export async function POST(req: Request) {
  try {
    const { key, value } = await req.json();
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(setting);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}