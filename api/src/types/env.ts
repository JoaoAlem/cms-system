// api/src/types/env.ts
import type { AuthSession } from "../lib/auth.js";

export type AppEnv = {
  Variables: {
    session: AuthSession | null;
  };
};