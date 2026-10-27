import { categories, tickets } from "@/shared/db/schemas";
import { relations } from "drizzle-orm";

export const categoryRelations = relations(categories, ({ many }) => ({
  tickets: many(tickets)
}));
