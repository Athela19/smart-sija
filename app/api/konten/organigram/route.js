import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";

export const config = {
  api: {
    bodyParser: false,
  },
};

// POST: Tambah Kata Guru
export async function POST(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { nama, jabatan, kutipan } = fields;
    const foto = files.foto;

    if (!foto) {
      return NextResponse.json({ message: "Foto wajib diunggah" }, { status: 400 });
    }

    const fotoUrl = await uploadFile(foto);

    const data = await prisma.organigram.create({
      data: {
        nama,
        jabatan,
        kutipan,
        foto: fotoUrl,
      },
    });
    await prisma.riwayat.create({
      data: {
        userId: user.id,  // pakai user.id dari hasil query
        aksi: "Menambahkan Organigram",
      },
    });

    return NextResponse.json({ message: "Kutipan berhasil disimpan", data }, { status: 201 });
  } catch (error) {
    console.error("POST organigram error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET: Ambil semua
export async function GET() {
  try {
    const list = await prisma.organigram.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error("GET organigram error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
