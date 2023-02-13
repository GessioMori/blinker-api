/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `private-links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "private-links_slug_key" ON "private-links"("slug");
