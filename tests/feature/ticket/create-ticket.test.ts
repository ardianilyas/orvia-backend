import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../helpers/auth.helper.ts";
import type { CreateTicketDto } from "@/feature/ticket/ticket.dto.ts";
import { createCategoryInDb } from "../../helpers/category.helper.ts";
import app from "@/server.ts";
import { TICKET_SUCCESS_MESSAGE, TICKET_TEST_ROUTE } from "@/feature/ticket/ticket.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";

describe("Create ticket", () => {
  let user: ReturnType<typeof request.agent>;
  let payload: CreateTicketDto;

  beforeAll(async () => {
    const { agent } = await authenticate();

    const category = await createCategoryInDb();

    payload = {
      categoryId: category.id,
      title: "Test ticket",
      description: "Test ticket description",
      status: "open",
      priority: "medium"
    }

    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).post(TICKET_TEST_ROUTE.CREATE_TICKET).send(payload);

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when body is invalid', async () => {
    const res = await user.post(TICKET_TEST_ROUTE.CREATE_TICKET).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATION_ERROR);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors).toBeInstanceOf(Object);
  });

  it('should return 201 when ticket is created', async () => {
    const res = await user.post(TICKET_TEST_ROUTE.CREATE_TICKET).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe(TICKET_SUCCESS_MESSAGE.CREATE_TICKET);
    expect(res.body.data).toBeInstanceOf(Object);
  });
});
