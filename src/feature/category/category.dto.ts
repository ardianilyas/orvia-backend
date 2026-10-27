import { z } from "zod";
import { CATEGORY_VALIDATION_MESSAGE } from "./category.constant";

export const createCategoryDto = z.object({
  name: z.string().min(3, { error: CATEGORY_VALIDATION_MESSAGE.NAME_MIN_LENGTH(3) }).max(100, { error: CATEGORY_VALIDATION_MESSAGE.NAME_MAX_LENGTH(100) }),
  description: z.string().min(3, { error: CATEGORY_VALIDATION_MESSAGE.DESCRIPTION_MIN_LENGTH(3) }).max(255, { error: CATEGORY_VALIDATION_MESSAGE.DESCRIPTION_MAX_LENGTH(255) }),
});

export const updateCategoryDto = createCategoryDto.partial();
export const getCategoryDto = z.string().uuid("Invalid UUID format");

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type GetCategoryDto = z.infer<typeof getCategoryDto>;
