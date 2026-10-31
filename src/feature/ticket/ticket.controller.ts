import type { TicketService } from "@/feature/ticket/ticket.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { AuthenticatedRequest } from "@/shared/types";
import { sendSuccess } from "@/shared/utils/response.ts";
import type { Response } from "express";
import { assignTicketDto, createTicketDto, getTicketDto, updateTicketDto } from "@/feature/ticket/ticket.dto.ts";
import { validate } from "@/shared/utils/validate.ts";
import { TICKET_SUCCESS_MESSAGE } from "@/feature/ticket/ticket.constant.ts";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  getTicketsByAuthorId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const tickets = await this.ticketService.getTicketsByAuthorId(req.auth.user.id);
    return sendSuccess(res, TICKET_SUCCESS_MESSAGE.GET_TICKETS, tickets);
  });

  getTicketById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const ticket = await this.ticketService.getTicketById(id);
    return sendSuccess(res, TICKET_SUCCESS_MESSAGE.GET_TICKET, ticket);
  });

  createTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validate(createTicketDto, req.body);
    const ticket = await this.ticketService.createTicket(req.auth.user.id, data);
    return sendSuccess(res, TICKET_SUCCESS_MESSAGE.CREATE_TICKET, ticket, 201);
  });

  updateTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const data = validate(updateTicketDto, req.body);
    const ticket = await this.ticketService.updateTicket(id, data);
    return sendSuccess(res, TICKET_SUCCESS_MESSAGE.UPDATE_TICKET, ticket);
  });

  assignTicketToAgent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    const data = validate(assignTicketDto, req.body);
    const ticket = await this.ticketService.assignTicketToAgent(id, data);
    return sendSuccess(res, TICKET_SUCCESS_MESSAGE.ASSIGN_TICKET_TO_AGENT, ticket);
  });

  deleteTicket = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getTicketDto, req.params.id);
    await this.ticketService.deleteTicket(id);
    return sendSuccess(res, "", null, 204);
  });
}
