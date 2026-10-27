import { relations } from "drizzle-orm";
import { categories, tickets, user } from "@/shared/db/schemas";

export const ticketRelations = relations(tickets, ({ one }) => ({
  author: one(user, {
    fields: [tickets.authorId],
    references: [user.id],
    relationName: "ticket_author"
  }),
  agent: one(user, {
    fields: [tickets.assignedAgentId],
    references: [user.id],
    relationName: "ticket_agent"
  }),
  category: one(categories, {
    fields: [tickets.categoryId],
    references: [categories.id],
  })
}));
