import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const riwayat = await prisma.riwayat.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(riwayat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/riwayat error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
