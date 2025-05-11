import { validate } from "uuid";
import { ServerResponse } from "http";
import fs from "fs/promises";
import { User } from "../interface";

export default async function del(
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
    const users = file.trim() ? JSON.parse(file) : [];

    const index = (users as Array<User>).findIndex(
      (user) => user.id === userID,
    );

    if (index === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    (users as Array<User>).splice(index, 1);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
    res.writeHead(204);
    res.end();
  } catch {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "server error" }));
  }
}
