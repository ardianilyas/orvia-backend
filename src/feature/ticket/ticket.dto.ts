import { z } from "zod";
import { ticketPriority, ticketStatus } from "@/shared/db/schemas";
import { TICKET_VALIDATION_MESSAGE } from "@/feature/ticket/ticket.constant.ts";

export const createTicketDto = z.object({
  categoryId: z.string({ error: TICKET_VALIDATION_MESSAGE.CATEGORY_REQUIRED }),
  title: z.string().min(3, { error: TICKET_VALIDATION_MESSAGE.TITLE_MIN(3) }).max(100, { error: TICKET_VALIDATION_MESSAGE.TITLE_MAX(100) }),
  description: z.string().min(3, { error: TICKET_VALIDATION_MESSAGE.DESCRIPTION_MIN(3) }).max(1000, { error: TICKET_VALIDATION_MESSAGE.DESCRIPTION_MAX(1000) }),
  priority: z.enum(ticketPriority.enumValues).default("medium"),
  status: z.enum(ticketStatus.enumValues).default("open"),
});

export const updateTicketDto = createTicketDto.partial();
export const assignTicketDto = z.object({
  assigneeAgentId: z.string({ error: "Assignee agent id is required" }),
});
export const getTicketDto = z.uuid({ error: TICKET_VALIDATION_MESSAGE.ID_REQUIRED });

export type CreateTicketDto = z.infer<typeof createTicketDto>;
export type UpdateTicketDto = z.infer<typeof updateTicketDto>;
export type AssignTicketDto = z.infer<typeof assignTicketDto>;
export type GetTicketDto = z.infer<typeof getTicketDto>;
