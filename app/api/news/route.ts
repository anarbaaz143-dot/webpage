export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const article = await prisma.news.findUnique({ where: { id: Number(id) } });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);
  }
  const articles = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const article = await prisma.news.create({ data: body });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  const article = await prisma.news.update({ where: { id }, data });
  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ success: true });
}