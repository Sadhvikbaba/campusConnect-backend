-- CreateEnum
CREATE TYPE "Role" AS ENUM ('hosteller', 'dayScholar');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "srmId" TEXT NOT NULL,
    "gender" TEXT,
    "role" "Role",
    "avatar" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
