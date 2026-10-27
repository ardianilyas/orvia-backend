import { categories } from "../schemas/categories.schema";
import { tickets } from "../schemas/tickets.schema";
import { relations } from "drizzle-orm";

export const categoryRelations = relations(categories, ({ many }) => ({
  tickets: many(tickets)
}));
