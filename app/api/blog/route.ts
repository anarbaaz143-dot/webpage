export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSeo } from "@/lib/withSeo"; // ✅ added

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const post = await prisma.blog.findUnique({ where: { id: Number(id) } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  }
  const posts = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const post = await withSeo(() =>
    prisma.blog.create({ data: body })
  );

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();

  const post = await withSeo(() =>
    prisma.blog.update({ where: { id }, data })
  );

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await withSeo(() =>
    prisma.blog.delete({ where: { id } })
  );

  return NextResponse.json({ success: true });
}