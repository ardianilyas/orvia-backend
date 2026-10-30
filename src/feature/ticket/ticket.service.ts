import type { Ticket } from "@/feature/ticket/ticket.type.ts";
import { db } from "@/shared/db";
import { tickets } from "@/shared/db/schemas";
import { desc, eq } from "drizzle-orm";
import { NotFoundError } from "@/shared/errors/not-found.ts";
import { TICKET_NOT_FOUND } from "@/feature/ticket/ticket.constant.ts";
import type { CreateTicketDto, UpdateTicketDto } from "@/feature/ticket/ticket.dto.ts";
import { DatabaseError } from "@/shared/errors/database-error.ts";
import { generateTicketCode } from "@/shared/utils/ticket-code.ts";

export class TicketService {
  async getTicketsByAuthorId(authorId: string): Promise<Ticket[]> {
    return db.select().from(tickets).where(eq(tickets.authorId, authorId)).orderBy(desc(tickets.createdAt));
  }

  async getTicketById(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));

    if (!ticket) throw new NotFoundError(TICKET_NOT_FOUND);

    return ticket;
  }

  async createTicket(authorId: string, data: CreateTicketDto): Promise<Ticket> {
    const ticketNumber = await generateTicketCode("ORV");

    const [ticket] = await db.insert(tickets).values({ ...data, authorId, ticketNumber }).returning();

    if (!ticket) throw new DatabaseError("Failed to create ticket");

    return ticket;
  }

  async updateTicket(id: string, data: UpdateTicketDto): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set(data).where(eq(tickets.id, id)).returning();

    if (!ticket) throw new NotFoundError(TICKET_NOT_FOUND);

    return ticket;
  }

  async deleteTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.delete(tickets).where(eq(tickets.id, id)).returning();

    if (!ticket) throw new NotFoundError(TICKET_NOT_FOUND);

    return ticket;
  }
}
