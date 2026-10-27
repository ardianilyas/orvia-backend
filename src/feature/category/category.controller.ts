import type { CategoryService } from "./category.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/utils/response";
import { validate } from "../../shared/utils/validate";
import { createCategoryDto, getCategoryDto } from "./category.dto";
import { CATEGORY_SUCCESS_MESSAGE } from "./category.constant";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getCategories = asyncHandler(async(_: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();

    return sendSuccess(res, CATEGORY_SUCCESS_MESSAGE.GET_CATEGORIES, categories);
  });

  getCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    const category = await this.categoryService.getCategory(id);

    return sendSuccess(res, CATEGORY_SUCCESS_MESSAGE.GET_CATEGORY, category);
  });

  createCategory = asyncHandler(async(req: Request, res: Response) => {
    const data = validate(createCategoryDto, req.body);
    const category = await this.categoryService.createCategory(data);

    return sendSuccess(res, CATEGORY_SUCCESS_MESSAGE.CREATE_CATEGORY, category, 201);
  });

  updateCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    const data = validate(createCategoryDto, req.body);
    const category = await this.categoryService.updateCategory(id, data);

    return sendSuccess(res, CATEGORY_SUCCESS_MESSAGE.UPDATE_CATEGORY, category);
  });

  deleteCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategoryDto, req.params.id);
    await this.categoryService.deleteCategory(id);

    return sendSuccess(res, "", null, 204);
  })
}