import { ServerResponse } from "http";
import { validate } from "uuid";
import fs from "fs/promises";
import { User } from "./interface";

export default async function getID(
  userID: string,
  res: ServerResponse,
  filePath: string,
) {
  if (!userID || !validate(userID)) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid userId (not a UUID)" }));
    return;
  }
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const users: User[] = file ? JSON.parse(file) : [];

    const user = users.find((i) => i.id === userID);

    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "user not found" }));
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(user));
  } catch {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Server error reading data" }));
  }
}
