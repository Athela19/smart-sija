import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findMany({
      where: { id: userId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User tidak ditemukan" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
