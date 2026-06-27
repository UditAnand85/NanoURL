import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

// Create the postgres connection client
const client = postgres(process.env.DATABASE_URL, { prepare: false });

// Create the Drizzle ORM instance with full schema awareness
export const db = drizzle(client, { schema });
