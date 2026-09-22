import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session-middleware.js";
import { requirePermission } from "../middleware/permission-middleware.js";
import type { AppEnv } from "../types/env.js";
import db from "db";

const roles = new Hono<AppEnv>({
  strict: false,
}).basePath("roles");

roles.get(
  "/",
  sessionMiddleware,
  requirePermission("view_roles"),
  async (context) => {
    const allRoles = await db.query.roles.findMany({
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

    return context.json(allRoles);
  },
);

export default roles;
