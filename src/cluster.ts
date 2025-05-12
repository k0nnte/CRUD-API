import { spawn } from "child_process";
import cluster from "cluster";
import dotenv from "dotenv";
import { cpus } from "os";
import http from "http";
import { resolve } from "path";
dotenv.config();

const PORT = parseInt(process.env.PORT || "4000");
const numCPUs = cpus().length - 1;
let currentWorker: number = 0;
const workers: number[] = [];

const work = resolve(__dirname, "worker.ts");

if (cluster.isPrimary) {
  console.log(`balanse from port ${PORT}`);

  for (let i = 0; i < numCPUs; i++) {
    const workerPort = PORT + i + 1;
    console.log(`start worker on port ${workerPort}`);
    spawn("npx", ["ts-node", work], {
      env: { ...process.env, PORT: workerPort.toString() },
      stdio: "inherit",
      shell: true,
    });
    workers.push(workerPort);
  }
}

const server = http.createServer((req, res) => {
  const target = workers[currentWorker];
  currentWorker = (currentWorker + 1) % workers.length;

  const proxy = http.request(
    {
      hostname: "localhost",
      port: target,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    },
  );
  proxy.on("error", (err) => {
    console.error(`Ошибка прокси: ${err.message}`);
  });
  req.pipe(proxy, { end: true });
});
server.listen(PORT);
