import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ message: "Email dan OTP wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.otp || !user.otpExpiresAt) {
    return NextResponse.json({ message: "OTP tidak ditemukan" }, { status: 400 });
  }

  // Cek kadaluarsa
  if (new Date() > new Date(user.otpExpiresAt)) {
    return NextResponse.json({ message: "OTP telah kadaluarsa" }, { status: 400 });
  }

  // Bandingkan OTP plaintext dengan hash di database
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    return NextResponse.json({ message: "OTP salah" }, { status: 400 });
  }

  // Bersihkan OTP setelah berhasil diverifikasi
  await prisma.user.update({
    where: { email },
    data: {
      otp: null,
      otpExpiresAt: null,
    },
  });

  return NextResponse.json({ message: "OTP valid" });
}
