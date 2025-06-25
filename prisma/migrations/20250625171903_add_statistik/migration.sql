-- CreateTable
CREATE TABLE "Statistik" (
    "id" SERIAL NOT NULL,
    "ruangan" INTEGER NOT NULL,
    "guru" INTEGER NOT NULL,
    "siswa" INTEGER NOT NULL,
    "mapel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistik_pkey" PRIMARY KEY ("id")
);
