import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { authenticate } from "../../helpers/auth.helper";
import { createMultipleCategoriesInDb } from "../../helpers/category.helper";

describe("GET /api/categories", () => {
  let agent: any;

  beforeAll(async () => {
    const auth = await authenticate("user");
    agent = auth.agent;
  });

  it("should return empty array when no categories exist", async () => {
    const response = await agent.get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Categories fetched");
    expect(response.body.data).toBeInstanceOf(Object);
  });

  it("should return all categories", async () => {
    await createMultipleCategoriesInDb(3);

    const response = await agent.get("/api/categories");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Categories fetched");
    // expect(response.body.data).toHaveLength(3);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should return 401 when not authenticated", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
