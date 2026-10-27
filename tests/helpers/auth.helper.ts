import request from "supertest";
import app from "../../src/server";
import { db } from "../../src/shared/db";
import * as schema from "../../src/shared/db/schemas";
import type { UserRole } from "../../src/shared/types/express";
import { eq } from "drizzle-orm";
import { faker } from "@faker-js/faker";

export async function authenticate(role: UserRole = "user") {
  const agent = request.agent(app)

  const user = {
    name: faker.person.firstName().toLowerCase(),
    email: faker.internet.email(),
    password: "developer"
  }

  const auth = await agent
    .post("/api/auth/sign-up/email")
    .send(user);

  const id = auth.body.user.id;

  const userData = await db.update(schema.user).set({ role }).where(eq(schema.user.id, id)).returning();

  const userId = userData[0]?.id ?? ""

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    })

  return {
    user,
    userId,
    agent
  }
}