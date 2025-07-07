import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "email salah" }, { status: 400 });
  }


  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashed,
    },
  });
  await prisma.riwayat.create({
    data: {
      userId: user.id,  // pakai user.id dari hasil query
      aksi: "Telah Mengubah Password",
    },
  });

  return NextResponse.json({ message: "Password berhasil direset" });
}
