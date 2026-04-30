export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";
import { withSeo } from "@/lib/withSeo"; // ✅ added

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      propoyeId, projectName, projectArea, location, address,
      floors, towers, possessionDate, configuration, pricingStartsFrom,
      pricingEndsAt, images, floorPlans, description, builderName, qrCodes,
    } = body;

    const slug = `${projectName.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-")}-${propoyeId.toLowerCase()}`;

    const property = await withSeo(() =>
      prisma.property.create({
        data: {
          propoyeId, projectName, projectArea, location, address,
          floors: floors, towers: towers,
          possessionDate, configuration, pricingStartsFrom,
          pricingEndsAt: pricingEndsAt ?? "",
          images:      images      ?? [],
          floorPlans:  floorPlans  ?? [],
          description: description ?? "",
          builderName: builderName ?? "",
          slug,
          qrCodes: qrCodes ?? [],
        },
      })
    );

    return NextResponse.json(property);
  } catch (err: any) {
    console.error("[POST /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id, propoyeId, projectName, projectArea, location, address,
      floors, towers, possessionDate, configuration, pricingStartsFrom,
      pricingEndsAt, images, floorPlans, isTrending, description, builderName,
      isReadyToMove, isUnderConstruction, isNewLaunch, isEarlypossesion, qrCodes
    } = body;

    const updated = await withSeo(() =>
      prisma.property.update({
        where: { id },
        data: {
          ...(propoyeId          !== undefined && { propoyeId }),
          ...(projectName        !== undefined && { projectName }),
          ...(projectArea        !== undefined && { projectArea }),
          ...(location           !== undefined && { location }),
          ...(address            !== undefined && { address }),
          ...(floors             !== undefined && { floors: floors }),
          ...(towers             !== undefined && { towers: towers }),
          ...(possessionDate     !== undefined && { possessionDate }),
          ...(configuration      !== undefined && { configuration }),
          ...(pricingStartsFrom  !== undefined && { pricingStartsFrom }),
          ...(pricingEndsAt      !== undefined && { pricingEndsAt }),
          ...(images             !== undefined && { images }),
          ...(floorPlans         !== undefined && { floorPlans }),
          ...(description        !== undefined && { description }),
          ...(builderName        !== undefined && { builderName }),
          ...(typeof isTrending === "boolean"        && { isTrending }),
          ...(typeof isReadyToMove === "boolean"     && { isReadyToMove }),
          ...(typeof isUnderConstruction === "boolean" && { isUnderConstruction }),
          ...(typeof isNewLaunch === "boolean"       && { isNewLaunch }),
          ...(typeof isEarlypossesion === "boolean"       && { isEarlypossesion }),
          ...(qrCodes !== undefined && { qrCodes }),
        },
      })
    );

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[PUT /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await withSeo(() =>
      prisma.property.delete({ where: { id } })
    );

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: any) {
    console.error("[DELETE /api/property]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}