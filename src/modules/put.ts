import { ServerResponse, IncomingMessage } from "http";
import { validate } from "uuid";
import parseUser from "./parse";
import fs from "fs/promises";
import { User } from "../interface";

export default async function put(
  userID: string,
  res: ServerResponse,
  filePath: string,
  req: IncomingMessage,
) {
  if (!userID || !validate(userID)) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid userId (not a UUID)" }));
    return;
  }
  const user = await parseUser(req);
  const file = await fs.readFile(filePath, "utf-8");
  const users = file.trim() ? JSON.parse(file) : [];
  const index = users.findIndex((user: User) => user.id === userID);
  if (index === -1) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }
  users[index] = { ...users[index], ...user };
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(user));
}
