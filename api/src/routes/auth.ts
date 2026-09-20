import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "db";
import argon2 from "argon2"

export const auth = betterAuth({
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
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
