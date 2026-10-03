import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import db from "db";
import argon2 from "argon2"

const ALLOWED_PATHS = new Set(["/sign-in/email"]);

export const auth = betterAuth({
  basePath: "/v1/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
		maxPasswordLength: 256,
    autoSignIn: true,
    password: {
			hash: async (password) => {
          return await argon2.hash(password)
			},
			verify: async ({ hash, password }) => {
        return await argon2.verify(hash, password)
			}
		}
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.request && !ALLOWED_PATHS.has(ctx.path)) {
        throw new APIError("NOT_FOUND");
      }
    }),
  },
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export type AuthSession = typeof auth.$Infer.Session;
