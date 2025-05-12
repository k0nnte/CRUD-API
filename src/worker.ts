import dotenv from "dotenv";
import server from "./server";

dotenv.config();

const port = parseInt(process.env.PORT || "0");

if (!port) {
  console.error("Порт not found");
  process.exit(1);
}

server.listen(Number(port), () => {
  console.log(`worker on port http://localhost:${port}`);
});
