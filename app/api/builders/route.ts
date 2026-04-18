import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const builders = await prisma.builder.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(builders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, image, established, projectsCount } = await req.json();
    if (!name || !description || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const builder = await prisma.builder.create({
      data: { name, description, image, established, projectsCount },
    });
    return NextResponse.json(builder);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const builder = await prisma.builder.update({
      where: { id },
      data,
    });
    return NextResponse.json(builder);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.builder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}