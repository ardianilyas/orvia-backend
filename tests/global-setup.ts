import { clearDb } from "./helpers/clear-db";
import { pool } from "../src/shared/db";

export async function setup() {
  await clearDb();
}

export async function teardown() {
  await clearDb();
  await pool.end();
}
