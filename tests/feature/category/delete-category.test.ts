import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../../src/server";
import { authenticate } from "../../helpers/auth.helper";
import { createCategoryInDb } from "../../helpers/category.helper";
import { db } from "../../../src/shared/db";
import { categories } from "../../../src/shared/db/schemas/categories.schema";
import { eq } from "drizzle-orm";

describe("DELETE /api/categories/:id", () => {
  let adminAgent: any;
  let userAgent: any;

  beforeAll(async () => {
    const adminAuth = await authenticate("admin");
    const userAuth = await authenticate("user");
    adminAgent = adminAuth.agent;
    userAgent = userAuth.agent;
  });

  it("should delete category successfully", async () => {
    const category = await createCategoryInDb();

    const response = await adminAgent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(204);
    
    const deletedCategory = await db.select().from(categories).where(eq(categories.id, category.id));
    expect(deletedCategory).toHaveLength(0);
  });

  it("should return 404 when category not found", async () => {
    const response = await adminAgent.delete("/api/categories/00000000-0000-0000-0000-000000000000");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Category not found");
  });

  it("should return 403 when user is not admin", async () => {
    const category = await createCategoryInDb();

    const response = await userAgent.delete(`/api/categories/${category.id}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it("should return 401 when not authenticated", async () => {
    const response = await request(app).delete("/api/categories/some-id");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
