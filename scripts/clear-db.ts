import { reset } from "drizzle-seed";
import { db } from "@/shared/db";
import * as schemas from "../src/shared/db/schemas";
import * as relations from "../src/shared/db/relations";

export async function clearDb() {
  await reset(db, {
    ...schemas,
    ...relations
  });
}

await clearDb();
