import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";
import fs from "fs/promises";
import path from "path";

// Agar bisa handle multipart/form-data saat PUT
export const config = {
  api: {
    bodyParser: false,
  },
};

// ====================
// GET produk by ID
// ====================
export async function GET(req, { params }) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const produk = await prisma.produk.findUnique({
      where: { id: numberId },
    });

    if (!produk) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(produk);
  } catch (error) {
    console.error("GET produk by ID error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ====================
// PUT update produk
// ====================
export async function PUT(req, { params }) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const produkLama = await prisma.produk.findUnique({ where: { id: numberId } });
    if (!produkLama) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    const { fields, files } = await parseForm(req);
    const { nama, deskripsi, pembuat } = fields;

    let fotoUrl = produkLama.foto;

    if (files.foto) {
      // Hapus file lama jika path lokal
      if (produkLama.foto?.startsWith("/uploads")) {
        const filePath = path.join(process.cwd(), "public", produkLama.foto);
        await fs.unlink(filePath).catch(() => {});
      }

      // Upload file baru
      fotoUrl = await uploadFile(files.foto);
    }

    const produkBaru = await prisma.produk.update({
      where: { id: numberId },
      data: { nama, deskripsi, pembuat, foto: fotoUrl },
    });

    // Catat riwayat update produk
    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: `Memperbarui produk: ${produkBaru.nama}`,
      },
    });

    return NextResponse.json({ message: "Produk berhasil diperbarui", data: produkBaru });
  } catch (error) {
    console.error("PUT produk error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ====================
// DELETE produk
// ====================
export async function DELETE(req, { params }) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const numberId = parseInt(id);
    if (isNaN(numberId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const produk = await prisma.produk.findUnique({ where: { id: numberId } });
    if (!produk) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    // Hapus file lokal jika ada
    if (produk.foto?.startsWith("/uploads")) {
      const filePath = path.join(process.cwd(), "public", produk.foto);
      await fs.unlink(filePath).catch(() => {});
    }

    await prisma.produk.delete({ where: { id: numberId } });

    // Catat riwayat hapus produk
    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: `Menghapus produk: ${produk.nama}`,
      },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("DELETE produk error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
