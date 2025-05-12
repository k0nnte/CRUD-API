import { IncomingMessage } from "http";
import { User } from "../interface";

export default function parseUser(req: IncomingMessage): Promise<User> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const user = JSON.parse(body);

        resolve(user);
      } catch {
        reject(new Error("error Json"));
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}
