import { v4 } from "uuid";
import parseUser from "./parse";
import { IncomingMessage, ServerResponse } from "http";
import fs from "fs/promises";
export default async function add(
  req: IncomingMessage,
  res: ServerResponse,
  filePath: string,
) {
  try {
    const newUser = await parseUser(req);

    const Field = ["username", "age", "hobbies"];

    const missing = Field.filter((key) => !(key in newUser));
    if (missing.length > 0) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify(`Отсутствуют обязательные поля: ${missing.join(", ")}`),
      );
      return;
    }
    const isValid =
      typeof newUser.username === "string" &&
      typeof newUser.age === "number" &&
      Array.isArray(newUser.hobbies) &&
      newUser.hobbies.every((i: string) => typeof i === "string");
    if (!isValid) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          error:
            "Неверные типы: username (string), age (number), hobbies (string[])",
        }),
      );
      return;
    }
    const user = {
      id: v4(),
      username: newUser.username,
      age: newUser.age,
      hobbies: newUser.hobbies,
    };

    const file = await fs.readFile(filePath, "utf-8");
    const users = file.trim() ? JSON.parse(file) : [];

    users.push(user);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(user));
  } catch (err) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify(`ошибка при создании: ${err}`));
  }
}
