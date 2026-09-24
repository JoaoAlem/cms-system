import { Hono } from "hono";
import { validator } from "hono/validator";
import { sessionMiddleware } from "../middleware/session-middleware.js";
import { requirePermission } from "../middleware/permission-middleware.js";

import type { AppEnv } from "../types/env.js";
import db, { createInsertSchema, DrizzleQueryError } from "db";
import { roles as rolesTable } from "db/schema";
import { z, ZodError } from "zod";
import { isPostgresError } from "../guards/databseError.js";

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

const roleInsertSchema = createInsertSchema(rolesTable, {
  name: z.string().max(255),
  title: z
    .string()
    .max(255)
    .refine((val) => /^[\x20-\x7E]*$/.test(val), {
      message: "String must contain only printable ASCII characters",
    }),
});

roles.post(
  "/",
  sessionMiddleware,
  requirePermission("create_roles"),
  validator("json", (value, context) => {
    try {
      return roleInsertSchema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        return context.json(
          {
            errorMessage: "Bad payload",
            error: error.issues,
          },
          400,
        );
      }

      return context.json(
        {
          errorMessage: "Internal Server Error",
        },
        500,
      );
    }
  }),
  async (context) => {
    try {
      const insertedRole = await db
        .insert(rolesTable)
        .values(context.req.valid("json"))
        .returning();

      return context.json(insertedRole, 201);
    } catch (error) {
      const cause = error instanceof DrizzleQueryError ? error.cause : error;

      if (isPostgresError(cause) && cause.code === "23505") {
        // duplicate name
        return context.json(
          {
            errorMessage: "A role with this name already exists",
          },
          409,
        );
      }

      console.error("Error inserting role:", error);
      return context.json(
        {
          errorMessage: "Internal Server Error",
        },
        500,
      );
    }
  },
);

roles.patch("/:id", sessionMiddleware, requirePermission("edit_roles"));
roles.put("/:id", sessionMiddleware, requirePermission("edit_roles"));
roles.delete("/:id", sessionMiddleware, requirePermission("delete_roles"));

export default roles;
