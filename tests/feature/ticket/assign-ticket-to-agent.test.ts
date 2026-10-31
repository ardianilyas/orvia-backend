import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../helpers/auth.helper";
import { createTicket } from "../../helpers/ticket.helper";
import app from "@/server";
import { TICKET_NOT_FOUND, TICKET_SUCCESS_MESSAGE, TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant";
import type { AssignTicketDto } from "@/feature/ticket/ticket.dto";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants";
import { INVALID_UUID } from "@/shared/types/test.type";

describe("Assign ticket to agent", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;
  let payload: AssignTicketDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("admin");
    const { userId: agentUserId } = await authenticate("agent");

    ticketId = await createTicket(userId);

    payload = {
      assigneeAgentId: agentUserId
    }

    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).patch(TICKET_TEST_ROUTE.ASSIGN_TICKET_TO_AGENT(ticketId)).send(payload);

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when ticket not found', async () => {
    const res = await user.patch(TICKET_TEST_ROUTE.ASSIGN_TICKET_TO_AGENT(INVALID_UUID)).send(payload);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TICKET_NOT_FOUND);
  });

  it('should return 200 when ticket assigned to agent', async () => {
    const res = await user.patch(TICKET_TEST_ROUTE.ASSIGN_TICKET_TO_AGENT(ticketId)).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(TICKET_SUCCESS_MESSAGE.ASSIGN_TICKET_TO_AGENT);
    expect(res.body.data.assignedAgentId).toBe(payload.assigneeAgentId);
  })
})