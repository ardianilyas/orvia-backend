import { categories } from "@/shared/db/schemas";

export type Category = typeof categories.$inferSelect;
