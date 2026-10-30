import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { UpdateTicketDto } from "@/feature/ticket/ticket.dto.ts";
import { authenticate } from "../../helpers/auth.helper.ts";
import { createTicket } from "../../helpers/ticket.helper.ts";
import app from "@/server.ts";
import { TICKET_NOT_FOUND, TICKET_SUCCESS_MESSAGE, TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/types/test.type.ts";

describe("Update ticket", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;
  let payload: UpdateTicketDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();

    ticketId = await createTicket(userId);

    payload = {
      title: "Test ticket update",
      description: "Test ticket update description"
    }

    user = agent;
  });

  it('should return 401 when user us unauthorized', async () => {
    const res = await request(app).patch(TICKET_TEST_ROUTE.UPDATE_TICKET(ticketId)).send(payload);

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when ticket id format invalid', async () => {
    const res = await user.patch(TICKET_TEST_ROUTE.UPDATE_TICKET('123')).send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
    expect(res.body.errors).toBeInstanceOf(Object);
  });

  it('should return 404 when ticket not found', async () => {
    const res = await user.patch(TICKET_TEST_ROUTE.UPDATE_TICKET(INVALID_UUID)).send(payload);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TICKET_NOT_FOUND);
  });

  it('should return 200 when ticket updated', async () => {
    const res = await user.patch(TICKET_TEST_ROUTE.UPDATE_TICKET(ticketId)).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(TICKET_SUCCESS_MESSAGE.UPDATE_TICKET);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.description).toBe(payload.description);
  });
});
