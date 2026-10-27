import { db } from "../../shared/db";
import { categories } from "../../shared/db/schemas/categories.schema";
import { desc, eq } from "drizzle-orm";
import type { Category } from "./category.type";
import { NotFoundError } from "../../shared/errors/not-found";
import { DatabaseError } from "../../shared/errors/database-error";
import type { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";

export class CategoryService {
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(desc(categories.createdAt));
  }

  async getCategory(id: string): Promise<Category> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));

    if (!category) throw new NotFoundError("Category not found");

    return category;
  }

  async createCategory(data: CreateCategoryDto): Promise<Category> {
    const [category] = await db.insert(categories).values(data).returning();

    if (!category) throw new DatabaseError("Failed to create category");

    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Category> {
    const [category] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();

    if (!category) throw new NotFoundError("Category not found");

    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const [category] = await db.delete(categories).where(eq(categories.id, id)).returning();

    if (!category) throw new NotFoundError("Category not found");

    return;
  }
}