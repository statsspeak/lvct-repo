import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${uuidv4()}${path.extname(file.name)}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`; // This is the URL that will be stored in the database
}
