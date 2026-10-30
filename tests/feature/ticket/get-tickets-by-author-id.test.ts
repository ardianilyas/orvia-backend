import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../helpers/auth.helper.ts";
import { createTickets } from "../../helpers/ticket.helper.ts";
import app from "@/server.ts";
import { TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";

describe("Get tickets by author id", () => {
  let user : ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    await createTickets(userId, 10);

    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(TICKET_TEST_ROUTE.GET_TICKETS);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 200 when user is authorized', async () => {
    const res = await user.get(TICKET_TEST_ROUTE.GET_TICKETS);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
  });
})