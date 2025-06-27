-- CreateTable
CREATE TABLE "Dokumentasi" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "foto1" TEXT NOT NULL,
    "foto2" TEXT NOT NULL,
    "foto3" TEXT NOT NULL,
    "foto4" TEXT NOT NULL,
    "foto5" TEXT NOT NULL,
    "foto6" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dokumentasi_pkey" PRIMARY KEY ("id")
);
