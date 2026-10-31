import { ticketPriority, tickets, ticketStatus } from "@/shared/db/schemas";
import { createCategoryInDb } from "./category.helper.ts";
import { faker } from "@faker-js/faker";
import { db } from "@/shared/db";
import { generateTicketCode } from "@/shared/utils/ticket-code.ts";

type InsertTicket = typeof tickets.$inferInsert;

export async function createTickets(authorId: string, length: number = 1) {
  const category = await createCategoryInDb();
  const data: InsertTicket[] = Array.from({ length }, () => ({
    authorId,
    categoryId: category.id,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    ticketNumber: faker.lorem.word(),
    priority: faker.helpers.arrayElement(ticketPriority.enumValues),
  }));

  return db.insert(tickets).values(data).returning();
}

export async function createTicket(authorId: string) {
  const category = await createCategoryInDb();
  const ticketNumber = await generateTicketCode("ORV");

  const data: InsertTicket = {
    ticketNumber,
    authorId,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    categoryId: category.id,
    status: faker.helpers.arrayElement(ticketStatus.enumValues),
    priority: faker.helpers.arrayElement(ticketPriority.enumValues),
  }

  const [ticket] = await db.insert(tickets).values(data).returning();

  if (!ticket) throw new Error("Failed to create ticket");

  return ticket.id;
}