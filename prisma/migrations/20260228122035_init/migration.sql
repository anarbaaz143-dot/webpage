-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "homeName" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "googleMapsLink" TEXT NOT NULL,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);
