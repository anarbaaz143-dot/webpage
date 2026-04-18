/*
  Warnings:

  - You are about to drop the column `description` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `googleMapsLink` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `homeName` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propoyeId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `configuration` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floors` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `possessionDate` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricingStartsFrom` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectArea` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectName` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propoyeId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `towers` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "description",
DROP COLUMN "googleMapsLink",
DROP COLUMN "homeName",
DROP COLUMN "place",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "configuration" TEXT NOT NULL,
ADD COLUMN     "floorPlans" TEXT[],
ADD COLUMN     "floors" INTEGER NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "possessionDate" TEXT NOT NULL,
ADD COLUMN     "pricingStartsFrom" TEXT NOT NULL,
ADD COLUMN     "projectArea" TEXT NOT NULL,
ADD COLUMN     "projectName" TEXT NOT NULL,
ADD COLUMN     "propoyeId" TEXT NOT NULL,
ADD COLUMN     "towers" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Property_propoyeId_key" ON "Property"("propoyeId");
