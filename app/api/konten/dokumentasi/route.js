import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";

// Handle multipart form
export const config = {
  api: {
    bodyParser: false,
  },
};

// =======================
// POST: Tambah Dokumentasi
// =======================
export async function POST(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { title } = fields;

    const fotoUrls = [];

    // Loop 6 file (foto1-foto6)
    for (let i = 1; i <= 6; i++) {
      const foto = files[`foto${i}`];
      if (!foto) {
        return NextResponse.json({ message: `Foto ${i} wajib diunggah` }, { status: 400 });
      }
      const uploadedUrl = await uploadFile(foto);
      fotoUrls.push(uploadedUrl);
    }

    // Simpan ke database
    const dokumentasi = await prisma.dokumentasi.create({
      data: {
        title,
        foto1: fotoUrls[0],
        foto2: fotoUrls[1],
        foto3: fotoUrls[2],
        foto4: fotoUrls[3],
        foto5: fotoUrls[4],
        foto6: fotoUrls[5],
      },
    });

    return NextResponse.json({ message: "Dokumentasi berhasil disimpan", data: dokumentasi }, { status: 201 });
  } catch (error) {
    console.error("POST Dokumentasi error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// =======================
// GET: Ambil Semua Dokumentasi
// =======================
export async function GET(req) {
 

  try {
    const data = await prisma.dokumentasi.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET Dokumentasi error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
