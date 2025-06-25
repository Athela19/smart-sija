// app/api/auth/route.js
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    // Ambil token dari cookie
    const token = cookies().get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized: No token" }), {
        status: 401,
      });
    }

    const user = verifyToken(token);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
        status: 401,
      });
    }

    // Ambil semua user
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "No user found" }), {
        status: 404,
      });
    }

    // Hilangkan password
    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);

    return new Response(JSON.stringify(usersWithoutPassword), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("GET /api/auth error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
