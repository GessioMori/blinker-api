/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `blog-links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "blog-links_url_key" ON "blog-links"("url");
