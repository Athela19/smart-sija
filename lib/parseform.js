import { IncomingForm } from "formidable";
import { Readable } from "stream";
import path from "path";

export async function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      uploadDir: path.join(process.cwd(), "public"), // atau bisa pakai 'tmp'
    });

    const readable = Readable.from(req.body);
    const fakeReq = Object.assign(readable, {
      headers: Object.fromEntries(req.headers),
      method: req.method,
      url: req.url,
    });

    form.parse(fakeReq, (err, fields, files) => {
      if (err) return reject(err);

      // 🔽 Hilangkan array jika hanya satu item
      for (const key in fields) {
        if (Array.isArray(fields[key]) && fields[key].length === 1) {
          fields[key] = fields[key][0];
        }
      }
      for (const key in files) {
        if (Array.isArray(files[key]) && files[key].length === 1) {
          files[key] = files[key][0];
        }
      }

      resolve({ fields, files });
    });
  });
}
