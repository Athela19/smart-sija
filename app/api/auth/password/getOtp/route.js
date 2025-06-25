import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
  }

  // Cek user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
  }

  // Generate OTP 6 digit
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP sebelum simpan
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Simpan OTP hashed dan expired
  await prisma.user.update({
    where: { email },
    data: {
      otp: hashedOtp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 menit
    },
  });

  // Kirim email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Kode OTP Reset Password",
    text: `Halo ${user.name},\n\nKode OTP kamu adalah: ${otp}\nKode ini berlaku selama 10 menit.\n\nTerima kasih.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "OTP terkirim ke email" });
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return NextResponse.json({ message: "Gagal mengirim OTP" }, { status: 500 });
  }
}
