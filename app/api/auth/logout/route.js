import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies(); // harus pakai await
    cookieStore.delete("token");

    return new Response(JSON.stringify({ message: "Logout berhasil" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
