import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", 
  ["admin", "agent", "user"]
);

export const ticketPriority = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const ticketStatus = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);
