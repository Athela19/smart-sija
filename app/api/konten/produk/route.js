import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";

// Agar bisa handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// =======================
// POST: Tambah Produk
// =======================
export async function POST(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { nama, deskripsi, pembuat } = fields;
    const foto = files.foto;

    if (!foto) {
      return NextResponse.json({ message: "Foto wajib diunggah" }, { status: 400 });
    }

    // Upload foto
    const fotoUrl = await uploadFile(foto);

    // Simpan ke database
    const produk = await prisma.produk.create({
      data: {
        nama,
        deskripsi,
        pembuat,
        foto: fotoUrl,
      },
    });

    // Tambah riwayat user
    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: `Menambahkan produk: ${nama}`,
      },
    });

    return NextResponse.json({ message: "Produk berhasil disimpan", data: produk }, { status: 201 });
  } catch (error) {
    console.error("POST Produk error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// =======================
// GET: Ambil Semua Produk
// =======================
export async function GET(req) {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    console.error("GET Produk error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
