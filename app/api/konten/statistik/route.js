import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

// GET - Ambil semua data statistik
export async function GET(req) {
  const statistik = await prisma.statistik.findMany();
  return new Response(JSON.stringify(statistik), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST - Buat data statistik baru
export async function POST(req) {
  const user = await getAdminUser(req);
  if (!user)
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const { ruangan, guru, siswa, mapel } = await req.json();

  const created = await prisma.statistik.create({
    data: { ruangan, guru, siswa, mapel },
  });

  // Tambah riwayat
  await prisma.riwayat.create({
    data: {
      userId: user.id,
      aksi: `Membuat data statistik baru (id: ${created.id})`,
    },
  });

  return new Response(JSON.stringify(created), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

// PUT - Update data statistik pertama
export async function PUT(req) {
  const user = await getAdminUser(req);
  if (!user)
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });

  const { ruangan, guru, siswa, mapel } = await req.json();

  const existing = await prisma.statistik.findUnique({ where: { id: 1 } });

  if (!existing) {
    return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updated = await prisma.statistik.update({
    where: { id: 1 },
    data: { ruangan, guru, siswa, mapel },
  });

  // Tambah riwayat
  await prisma.riwayat.create({
    data: {
      userId: user.id,
      aksi: `Mengupdate data statistik`,
    },
  });

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
