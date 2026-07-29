import app from "./app";
import { logger } from "./lib/logger";

// Use provided PORT, otherwise default to 3000 for environments
// where an explicit PORT isn't set (e.g. some Docker environments).
const rawPort = process.env["PORT"] ?? "3000";

const port = Number(rawPort);
if (!rawPort || Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid or missing PORT value: "${rawPort}"`);
}

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
