import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { parseForm } from "@/lib/parseform";
import { uploadFile } from "@/lib/upload";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// ====================
// GET dokumentasi by ID
// ====================
export async function GET(req, { params }) {

  try {
    const { id } =await params;
    const numberId = parseInt(id);

    if (isNaN(numberId)) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const data = await prisma.dokumentasi.findUnique({
      where: { id: numberId },
    });

    if (!data) {
      return NextResponse.json({ message: "Dokumentasi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ====================
// PUT update dokumentasi
// ====================
export async function PUT(req, { params }) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numberId = parseInt(id);

    const dokLama = await prisma.dokumentasi.findUnique({ where: { id: numberId } });

    if (!dokLama) {
      return NextResponse.json({ message: "Dokumentasi tidak ditemukan" }, { status: 404 });
    }

    const { fields, files } = await parseForm(req);
    const { title } = fields;

    const updatedData = { title };

    for (let i = 1; i <= 6; i++) {
      const key = `foto${i}`;
      if (files[key]) {
        const lama = dokLama[key];
        if (lama?.startsWith("/uploads")) {
          const filePath = path.join(process.cwd(), "public", lama);
          await fs.unlink(filePath).catch(() => {});
        }

        updatedData[key] = await uploadFile(files[key]);
      } else {
        updatedData[key] = dokLama[key]; // tetap pakai yang lama
      }
    }

    const updated = await prisma.dokumentasi.update({
      where: { id: numberId },
      data: updatedData,
    });

    await prisma.riwayat.create({
      data: {
        userId: user.id,
        aksi: "Mengupdate Dokumentasi",
      },
    });
    
    return NextResponse.json({ message: "Dokumentasi berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("PUT Dokumentasi error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ====================
// DELETE dokumentasi
// ====================
export async function DELETE(req, { params }) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numberId = parseInt(id);

    const dok = await prisma.dokumentasi.findUnique({ where: { id: numberId } });

    if (!dok) {
      return NextResponse.json({ message: "Dokumentasi tidak ditemukan" }, { status: 404 });
    }

    for (let i = 1; i <= 6; i++) {
      const key = `foto${i}`;
      if (dok[key]?.startsWith("/uploads")) {
        const filePath = path.join(process.cwd(), "public", dok[key]);
        await fs.unlink(filePath).catch(() => {});
      }
    }

    await prisma.dokumentasi.delete({ where: { id: numberId } });

    return NextResponse.json({ message: "Dokumentasi berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Dokumentasi error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
