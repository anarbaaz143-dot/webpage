export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* ================= GET ================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search");

  if (query) {
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { projectName: { contains: query, mode: "insensitive" } },
          { location:    { contains: query, mode: "insensitive" } },
          { propoyeId:   { contains: query, mode: "insensitive" } },
          { projectArea: { contains: query, mode: "insensitive" } },
          { address:     { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(properties);
  }

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(properties);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      propoyeId, projectName, projectArea, location, address,
      floors, towers, possessionDate, configuration, pricingStartsFrom,
      images, floorPlans, description, builderName,
    } = body;

    const property = await prisma.property.create({
      data: {
        propoyeId, projectName, projectArea, location, address,
        floors: Number(floors), towers: Number(towers),
        possessionDate, configuration, pricingStartsFrom,
        images:      images      ?? [],
        floorPlans:  floorPlans  ?? [],
        description: description ?? "",
        builderName: builderName ?? "",
      },
    });

    return NextResponse.json(property);
  } catch (err: any) {
    console.error("[POST /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
const {
  id, propoyeId, projectName, projectArea, location, address,
  floors, towers, possessionDate, configuration, pricingStartsFrom,
  images, floorPlans, isTrending, description, builderName,
  isReadyToMove, isUnderConstruction, isNewLaunch,
} = body;

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...(propoyeId          !== undefined && { propoyeId }),
        ...(projectName        !== undefined && { projectName }),
        ...(projectArea        !== undefined && { projectArea }),
        ...(location           !== undefined && { location }),
        ...(address            !== undefined && { address }),
        ...(floors             !== undefined && { floors: Number(floors) }),
        ...(towers             !== undefined && { towers: Number(towers) }),
        ...(possessionDate     !== undefined && { possessionDate }),
        ...(configuration      !== undefined && { configuration }),
        ...(pricingStartsFrom  !== undefined && { pricingStartsFrom }),
        ...(images             !== undefined && { images }),
        ...(floorPlans         !== undefined && { floorPlans }),
        ...(description        !== undefined && { description }),
        ...(builderName        !== undefined && { builderName }),
        ...(typeof isTrending === "boolean"  && { isTrending }),
        ...(typeof isReadyToMove === "boolean" && { isReadyToMove }),
...(typeof isUnderConstruction === "boolean" && { isUnderConstruction }),
...(typeof isNewLaunch === "boolean" && { isNewLaunch }),
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[PUT /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("[DELETE /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}