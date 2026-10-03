import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { auth } from "../lib/auth.js";

import type { AppEnv } from "../types/env.js";
export const sessionMiddleware = createMiddleware<AppEnv>(
  async (context, next) => {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    if (!session) {
      throw new HTTPException(401, { message: "You must be logged in" });
    }

    context.set("session", session);
    await next();
  },
);
