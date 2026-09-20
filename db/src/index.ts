import { config } from 'dotenv';
config({ path: new URL('../.env', import.meta.url) });

import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './db/relations.js';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!
  },
  relations: relations
})
