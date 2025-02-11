/*
  Warnings:

  - Added the required column `publishedDate` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "publishedDate" TIMESTAMP(3) NOT NULL;
