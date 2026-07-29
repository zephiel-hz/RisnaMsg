import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API router first so API routes take precedence.
app.use("/api", router);

// If the frontend build exists, serve it at the site root so the project root
// shows the web UI instead of redirecting to the health endpoint.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistCandidates = [
  path.resolve(process.cwd(), "public"),
  path.resolve(process.cwd(), "artifacts", "special-message", "dist", "public"),
  path.resolve(process.cwd(), "artifacts", "special-message", "dist"),
  path.resolve(process.cwd(), "special-message", "dist", "public"),
  path.resolve(process.cwd(), "special-message", "dist"),
  path.resolve(__dirname, "..", "..", "special-message", "dist", "public"),
  path.resolve(__dirname, "..", "..", "special-message", "dist"),
  path.resolve(__dirname, "..", "..", "..", "artifacts", "special-message", "dist", "public"),
];
const frontendDist = frontendDistCandidates.find((candidate) => existsSync(candidate));
const frontendIndexHtml = frontendDist ? path.resolve(frontendDist, "index.html") : null;

if (frontendIndexHtml && existsSync(frontendIndexHtml)) {
  app.get(["/", "/index.html"], (_req, res) => {
    res.sendFile(frontendIndexHtml);
  });
  app.use(express.static(frontendDist!));
}

export default app;
