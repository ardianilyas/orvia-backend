import { tickets } from "@/shared/db/schemas";

export type Ticket = typeof tickets.$inferSelect;
