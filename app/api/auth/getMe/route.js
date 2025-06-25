import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    // Ambil cookie dari request header
    const cookies = parse(req.headers.get("cookie") || "");

    const token = cookies.token;

    if (!token) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Verifikasi token
    const decoded = verify(token, JWT_SECRET);

    // Ambil user dari database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Hapus password sebelum dikirim
    const { password, ...userWithoutPassword } = user;

    // ✅ Bungkus data dalam { user: ... }
    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error verifikasi token:", error); // 🔍 Debugging
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }
}
