import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { authenticate } from "../../helpers/auth.helper";
import { createCategoryInDb } from "../../helpers/category.helper";

describe("GET /api/categories/:id", () => {
  let agent: any;

  beforeAll(async () => {
    const auth = await authenticate("user");
    agent = auth.agent;
  });

  it("should return category by id", async () => {
    const category = await createCategoryInDb();

    const response = await agent.get(`/api/categories/${category.id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Category fetched");
    expect(response.body.data.id).toBe(category.id);
    expect(response.body.data.name).toBe(category.name);
  });

  it("should return 404 when category not found", async () => {
    const response = await agent.get("/api/categories/00000000-0000-0000-0000-000000000000");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Category not found");
  });

  it("should return 401 when not authenticated", async () => {
    const response = await request(app).get("/api/categories/some-id");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
