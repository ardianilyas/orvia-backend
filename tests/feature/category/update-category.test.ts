import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { authenticate } from "../../helpers/auth.helper";
import { createCategoryInDb, createCategoryData } from "../../helpers/category.helper";

describe("PATCH /api/categories/:id", () => {
  let adminAgent: any;
  let userAgent: any;

  beforeAll(async () => {
    const adminAuth = await authenticate("admin");
    const userAuth = await authenticate("user");
    adminAgent = adminAuth.agent;
    userAgent = userAuth.agent;
  });

  it("should update category successfully", async () => {
    const category = await createCategoryInDb();
    const updateData = createCategoryData();

    const response = await adminAgent.patch(`/api/categories/${category.id}`).send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Category updated");
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.description).toBe(updateData.description);
  });

  it("should return 404 when category not found", async () => {
    const updateData = createCategoryData();

    const response = await adminAgent.patch("/api/categories/00000000-0000-0000-0000-000000000000").send(updateData);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Category not found");
  });

  it("should return 400 when name is too short", async () => {
    const category = await createCategoryInDb();

    const response = await adminAgent.patch(`/api/categories/${category.id}`).send({
      name: "ab",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return 403 when user is not admin", async () => {
    const category = await createCategoryInDb();
    const updateData = createCategoryData();

    const response = await userAgent.patch(`/api/categories/${category.id}`).send(updateData);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it("should return 401 when not authenticated", async () => {
    const updateData = createCategoryData();

    const response = await request(app).patch("/api/categories/some-id").send(updateData);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
