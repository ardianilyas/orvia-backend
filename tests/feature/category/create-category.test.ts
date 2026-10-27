import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { authenticate } from "../../helpers/auth.helper";
import { createCategoryData } from "../../helpers/category.helper";

describe("POST /api/categories", () => {
  let adminAgent: any;
  let userAgent: any;

  beforeAll(async () => {
    const adminAuth = await authenticate("admin");
    const userAuth = await authenticate("user");
    adminAgent = adminAuth.agent;
    userAgent = userAuth.agent;
  });

  it("should create category successfully", async () => {
    const data = createCategoryData();

    const response = await adminAgent.post("/api/categories").send(data);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Category created");
    expect(response.body.data.name).toBe(data.name);
    expect(response.body.data.description).toBe(data.description);
    expect(response.body.data.id).toBeDefined();
  });

  it("should return 400 when name is too short", async () => {
    const response = await adminAgent.post("/api/categories").send({
      name: "ab",
      description: "Valid description",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 400 when name is too long", async () => {
    const response = await adminAgent.post("/api/categories").send({
      name: "a".repeat(101),
      description: "Valid description",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 400 when description is too short", async () => {
    const response = await adminAgent.post("/api/categories").send({
      name: "Valid name",
      description: "ab",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 403 when user is not admin", async () => {
    const data = createCategoryData();

    const response = await userAgent.post("/api/categories").send(data);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it("should return 401 when not authenticated", async () => {
    const data = createCategoryData();

    const response = await request(app).post("/api/categories").send(data);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
