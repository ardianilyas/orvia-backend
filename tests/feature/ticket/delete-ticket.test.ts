import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../helpers/auth.helper.ts";
import { createTicket } from "../../helpers/ticket.helper.ts";
import app from "@/server.ts";
import { TICKET_NOT_FOUND, TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/types/test.type.ts";

describe("Delete ticket", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();

    ticketId = await createTicket(userId);

    user = agent;
  });

  it('should return 401 when user is unauhtorized', async () => {
    const res = await request(app).delete(TICKET_TEST_ROUTE.DELETE_TICKET(ticketId));

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when id format is invalid', async () => {
    const res = await user.delete(TICKET_TEST_ROUTE.DELETE_TICKET("invalid-uuid"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
    expect(res.body.errors).toBeInstanceOf(Object);
  });

  it('should return 404 when id not found', async () => {
    const res = await user.delete(TICKET_TEST_ROUTE.DELETE_TICKET(INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TICKET_NOT_FOUND);
  });

  it('should return 204 when ticket deleted', async () => {
    const res = await user.delete(TICKET_TEST_ROUTE.DELETE_TICKET(ticketId));

    expect(res.status).toBe(204);
  });
});
