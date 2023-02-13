-- CreateEnum
CREATE TYPE "Blog" AS ENUM ('DEVGO');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscriptions" "Blog"[];

-- CreateTable
CREATE TABLE "blog-links" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "blogName" "Blog" NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog-links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog-links_slug_key" ON "blog-links"("slug");
