import { createMiddleware } from "hono/factory";
import { auth } from "../lib/auth.js";
import type { AppEnv } from "../types/env.js";
import { HTTPException } from "hono/http-exception";

export const sessionMiddleware = createMiddleware<AppEnv>(
  async (context, next) => {
    const session = await auth.api.getSession({
      headers: context.req.raw.headers,
    });

    if (!session) {
      throw new HTTPException(401, { message: "Você precisa fazer login" })
    }

    context.set("session", session);
    await next();
  },
);