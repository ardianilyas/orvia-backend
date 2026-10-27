import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { categories } from "@/shared/db/schemas/categories.schema.ts";
import { ticketPriority, ticketStatus } from "@/shared/db/schemas/enums.schema.ts";
import { user } from "@/shared/db/schemas/users.schema.ts";

export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: text("author_id").references(() => user.id).notNull(),
  assignedAgentId: text("assigned_agent_id").references(() => user.id),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  ticketNumber: text("ticket_number").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: ticketStatus().notNull().default("open"),
  priority: ticketPriority().notNull().default("medium"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
