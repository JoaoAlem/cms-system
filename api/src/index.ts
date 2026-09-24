import { config } from "dotenv";
config({ path: new URL("../.env", import.meta.url) });

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { AppEnv } from "./types/env.js";
import routes from "./routes/index.js";

const app = new Hono<AppEnv>({
  strict: false,
}).basePath("/v1");

app.get("/", (c) => {
  return c.text("Hello from the API!");
});

routes.forEach((route) => {
  app.route("/", route);
});

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
