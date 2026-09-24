import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "../types/env.js";
import { checkUserPermissions } from "db/queries";

export const requirePermission = (requiredPermissions: string | string[]) =>
  createMiddleware<AppEnv>(async (context, next) => {
    const session = context.get("session");

    if (!session) {
      throw new HTTPException(401, {
        message: "You must be logged in",
      });
    }

    const hasPermission = await checkUserPermissions(
      session.user.id,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new HTTPException(403, {
        message: "You do not have permission to access this resource",
      });
    }

    await next();
  });
