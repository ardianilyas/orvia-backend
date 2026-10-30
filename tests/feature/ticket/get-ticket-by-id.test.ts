import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../helpers/auth.helper.ts";
import { createTicket } from "../../helpers/ticket.helper.ts";
import app from "@/server.ts";
import { TICKET_NOT_FOUND, TICKET_SUCCESS_MESSAGE, TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/types/test.type.ts";

describe("Get ticket by id", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();

    ticketId = await createTicket(userId);

    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(TICKET_TEST_ROUTE.GET_TICKET(ticketId));

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when data not found', async () => {
    const res = await user.get(TICKET_TEST_ROUTE.GET_TICKET(INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TICKET_NOT_FOUND);
  });

  it('should return 200 when data found and show ticket detail', async () => {
    const res = await user.get(TICKET_TEST_ROUTE.GET_TICKET(ticketId));

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.message).toBe(TICKET_SUCCESS_MESSAGE.GET_TICKET);
  });
});
