import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { openAPI } from "better-auth/plugins";
import { db } from "db";
import argon2 from "argon2"

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
  plugins: [openAPI()],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
