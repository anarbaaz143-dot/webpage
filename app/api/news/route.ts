export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSeo } from "@/lib/withSeo";

// 🔹 helper (first 4 words slug)
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join("-");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get("slug"); // ✅ added
  const id = searchParams.get("id");

  if (slug) {
    const article = await prisma.news.findUnique({ where: { slug } });
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(article);  
  }

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

  const slug = generateSlug(body.title); // ✅ added

  const article = await withSeo(() =>
    prisma.news.create({
      data: {
        ...body,
        slug, // ✅ added
      },
    })
  );

  return NextResponse.json(article);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();

  const slug = data.title ? generateSlug(data.title) : undefined; // ✅ added

  const article = await withSeo(() =>
    prisma.news.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }), // ✅ added
      },
    })
  );

  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  await withSeo(() =>
    prisma.news.delete({ where: { id } })
  );

  return NextResponse.json({ success: true });
}