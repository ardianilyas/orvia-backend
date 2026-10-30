import { db } from "@/shared/db";
import { categories } from "@/shared/db/schemas";
import { faker } from "@faker-js/faker";

export function createCategoryData(overrides: Partial<{ name: string; description: string }> = {}) {
  return {
    name: overrides.name || faker.commerce.department(),
    description: overrides.description || faker.commerce.productDescription(),
  };
}

export async function createCategoryInDb(overrides: Partial<{ name: string; description: string }> = {}) {
  const data = createCategoryData(overrides);
  const [category] = await db.insert(categories).values(data).returning();

  if (!category) {
    throw new Error("Failed to create category in database");
  }

  return category;
}

export async function createMultipleCategoriesInDb(count: number = 3) {
  const categoriesData = Array.from({ length: count }, () => createCategoryData());
  return db.insert(categories).values(categoriesData).returning();
}
