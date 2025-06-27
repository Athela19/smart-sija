import path from "path";
import fs from "fs/promises";

export async function uploadFile(file, folder = "uploads") {
  if (!file || !file.filepath) {
    throw new Error("File tidak valid atau tidak ada filepath");
  }

  // Pastikan folder tidak pakai slash depan
  folder = folder.replace(/^\/+/, ""); // hapus "/" di awal jika ada

  const fileName = Date.now() + "_" + file.originalFilename;
  const uploadPath = path.join(process.cwd(), "public", folder); // 👉 C:/path/to/project/public/uploads
  const filePath = path.join(uploadPath, fileName);

  await fs.mkdir(uploadPath, { recursive: true });

  const fileData = await fs.readFile(file.filepath);
  await fs.writeFile(filePath, fileData);

  return `/${folder}/${fileName}`; // digunakan oleh browser
}
