import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";

// Config agar bisa handle multipart
export const config = {
  api: {
    bodyParser: false,
  },
};

// GET: Ambil detail 1 guru
export async function GET(_, { params }) {
  const { id } = params;
  const numberId = parseInt(id);

  if (isNaN(numberId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const data = await prisma.organigram.findUnique({
      where: { id: numberId },
    });

    if (!data) {
      return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET ID organigram error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Edit kata guru
export async function PUT(req, { params }) {
  const { id } = params;
  const numberId = parseInt(id);

  if (isNaN(numberId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ambil dulu data lama untuk riwayat
    const oldData = await prisma.organigram.findUnique({
      where: { id: numberId },
      select: { nama: true },
    });

    if (!oldData) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    const { fields, files } = await parseForm(req);
    const { nama, jabatan, kutipan } = fields;

    let dataToUpdate = { nama, jabatan, kutipan };

    if (files.foto) {
      const fotoUrl = await uploadFile(files.foto);
      dataToUpdate.foto = fotoUrl;
    }

    const updated = await prisma.organigram.update({
      where: { id: numberId },
      data: dataToUpdate,
    });

    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: `Mengupdate Organigram ${oldData.nama}`,
      },
    });

    return NextResponse.json({ message: "Berhasil diubah", data: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT organigram error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// DELETE: Hapus kata guru
export async function DELETE(req, { params }) {
  const { id } = params;
  const numberId = parseInt(id);

  if (isNaN(numberId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ambil dulu data nama untuk riwayat
    const data = await prisma.organigram.findUnique({
      where: { id: numberId },
      select: { nama: true },
    });

    if (!data) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    await prisma.organigram.delete({
      where: { id: numberId },
    });

    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: `Menghapus Organigram ${data.nama}`,
      },
    });

    return NextResponse.json({ message: "Berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("DELETE organigram error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
