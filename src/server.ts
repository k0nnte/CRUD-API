import http, { IncomingMessage, ServerResponse } from "http";
import { resolve } from "path";
import dotenv from "dotenv";
import add from "./modules/add";
import get from "./modules/get";
import put from "./modules/put";
import del from "./modules/delete";
import getID from "./modules/getID";
dotenv.config();

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const filePath = resolve(__dirname, "..", "data", "person.json");
    const { url, method } = req;
    if (method === "GET") {
      const path = url.split("/") || [];
      if (
        url === "/api/users" ||
        (url === "/api/users/" && path[3].trim() === "")
      ) {
        await get(res, filePath);
        console.log(`my port is ${process.env.PORT}`);

        return;
      }
      if (url.startsWith("/api/users/") && path[3].trim() !== "") {
        const userID = url.split("/").pop();
        await getID(userID, res, filePath);
        console.log(`my port is ${process.env.PORT}`);
        return;
      }
    }
    if ((url === "/api/users" || url === "/api/users/") && method === "POST") {
      await add(req, res, filePath);
      console.log(`my port is ${process.env.PORT}`);
      return;
    }
    if (url.startsWith("/api/users/") && method === "PUT") {
      const userID = url.split("/").pop();
      await put(userID, res, filePath, req);
      console.log(`my port is ${process.env.PORT}`);
      return;
    }
    if (url.startsWith("/api/users/") && method === "DELETE") {
      const userID = url.split("/").pop();
      await del(userID, res, filePath);
      console.log(`my port is ${process.env.PORT}`);
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Маршрут не найден" }));
  },
);

export default server;
