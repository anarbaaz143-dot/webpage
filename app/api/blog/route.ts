export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSeo } from "@/lib/withSeo";

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 4)
    .join("-")
    .replace(/[^a-z0-9-]/g, "");
}

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

  let slug = slugify(body.title);
  const existing = await prisma.blog.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await withSeo(() =>
    prisma.blog.create({ data: { ...body, slug } })
  );

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();

  let slug = slugify(data.title);
  const existing = await prisma.blog.findUnique({ where: { slug } });
  if (existing && existing.id !== id) slug = `${slug}-${Date.now()}`;

  const post = await withSeo(() =>
    prisma.blog.update({ where: { id }, data: { ...data, slug } })
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