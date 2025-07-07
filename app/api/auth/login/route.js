import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt"; // Ganti verifyToken jadi signToken
import { serialize } from "cookie";

// Gunakan dotenv jika belum
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response(JSON.stringify({ message: "User tidak ditemukan" }), {
      status: 401,
    });
  }

  // Verifikasi password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return new Response(JSON.stringify({ message: "Password salah" }), {
      status: 401,
    });
  }

  // Generate JWT
  const token = await signToken({ id: user.id, email: user.email });

  // Atur cookie
  const setCookie = serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });

  await prisma.riwayat.create({
    data: {
      userId: user.id,  // pakai user.id dari hasil query
      aksi: "Telah login ke sistem",
    },
  });


  // Kirim response
  return new Response(
    JSON.stringify({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        name: user.name,
      },
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie": setCookie,
        "Content-Type": "application/json",
      },
    }
  );
}
