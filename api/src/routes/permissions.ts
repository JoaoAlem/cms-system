import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session-middleware.js";
import { requirePermission } from "../middleware/permission-middleware.js";
import type { AppEnv } from "../types/env.js";
import db from "db";

const permissions = new Hono<AppEnv>({
  strict: false,
}).basePath("permissions");

permissions.get(
  "/",
  sessionMiddleware,
  requirePermission("view_permissions"),
  async (context) => {
    const allPermissions = await db.query.permissions.findMany({
      where: {
        deletedAt: {
          isNull: true,
        },
      },
      columns: {
        id: true,
        name: true,
        title: true,
      },
    });

    return context.json(allPermissions);
  },
);

export default permissions;
