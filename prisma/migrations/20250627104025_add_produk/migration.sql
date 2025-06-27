/*
  Warnings:

  - You are about to drop the column `whatsapp` on the `Produk` table. All the data in the column will be lost.
  - Added the required column `pembuat` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produk" DROP COLUMN "whatsapp",
ADD COLUMN     "pembuat" TEXT NOT NULL;
