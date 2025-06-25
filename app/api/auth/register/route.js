import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password ,status} = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: "Missing required fields" }), {
      status: 400,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      status,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return new Response(JSON.stringify(userWithoutPassword), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
