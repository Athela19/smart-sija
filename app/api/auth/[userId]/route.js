import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const id = parseInt(userId)

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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

export async function DELETE(request, { params }) {
  try {
    const { userId } = await params;
    const id = parseInt(userId)

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User tidak ditemukan" }), {
        status: 404,
      });
    }

    // Hapus user
    await prisma.user.delete({
      where: { id: id },
    });


    return new Response(JSON.stringify({ message: "Akun berhasil dihapus" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}