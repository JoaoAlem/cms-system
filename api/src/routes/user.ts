import { Hono } from "hono";
import { sessionMiddleware } from "../middleware/session-middleware.js";
import type { AppEnv } from "../types/env.js";
import { db } from "db";
import { HTTPException } from "hono/http-exception";

const user = new Hono<AppEnv>({
  strict: false,
}).basePath("user")

user.get("/permissions", sessionMiddleware, async (context) => {
  const authSession = context.get("session")!;

  const userWithRoles = await db.query.user.findFirst({
    where: {
      id: authSession.user.id,
    },
    columns: {
      id: true,
    },
    with: {
      roles: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          permissions: {
            columns: {
              id: true,
              name: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!userWithRoles) {
    throw new HTTPException(404, {
      message: "Usuário não encontrado",
    });
  }

  const permissions = userWithRoles.roles.flatMap((role) => role.permissions);
  return context.json(permissions);
})

export default user
