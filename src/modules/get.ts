import { ServerResponse } from "http";
import fs from "fs/promises";

export default async function get(res: ServerResponse, filePath: string) {
  try {
    const data = await fs.readFile(filePath, "utf-8");

    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
    return;
  } catch {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Ошибка сервера при чтении файла" }));
    return;
  }
}
