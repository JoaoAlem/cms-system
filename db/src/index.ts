import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './db/relations';

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!
  },
  relations: relations
})