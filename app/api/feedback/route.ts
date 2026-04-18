import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { slot: "asc" },
    });
    return NextResponse.json(feedback);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slot, name, rating, description } = await req.json();
    if (!slot || !name || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const record = await prisma.feedback.upsert({
      where: { slot },
      update: { name, rating, description },
      create: { slot, name, rating, description },
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slot } = await req.json();
    await prisma.feedback.delete({ where: { slot } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}