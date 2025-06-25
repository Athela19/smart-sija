import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;

export async function getAdminUser(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) return null;

    const decoded = verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.status !== "ADMIN") return null;

    return user;
  } catch {
    return null;
  }
}

export async function getGuruUser(req) {
  try {
    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.token;

    if (!token) return null;

    const decoded = verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.status !== "GURU") return null;

    return user;
  } catch {
    return null;
  }
}
