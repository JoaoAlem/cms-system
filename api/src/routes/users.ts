import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session-middleware.js";
import { requirePermission } from "../middleware/permission-middleware.js";
import type { AppEnv } from "../types/env.js";
import db from "db";

const users = new Hono<AppEnv>({
  strict: false,
}).basePath("users");

users.get(
  "/",
  sessionMiddleware,
  requirePermission("view_users"),
  async (context) => {
    const allUsers = await db.query.user.findMany({
      where: {
        deletedAt: {
          isNull: true,
        },
      },
      columns: {
        id: true,
        name: true,
        image: true,
        email: true
    },
    });

    return context.json(allUsers);
  },
);

export default users;
