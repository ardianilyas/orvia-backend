export const CATEGORY_VALIDATION_MESSAGE = {
  ID_REQUIRED: "ID is required",
  NAME_REQUIRED: "Name is required",
  NAME_MIN_LENGTH: (length: number) => `Name must be at least ${length} characters long`,
  NAME_MAX_LENGTH: (length: number) => `Name must be at most ${length} characters long`,
  DESCRIPTION_REQUIRED: "Description is required",
  DESCRIPTION_MIN_LENGTH: (length: number) => `Description must be at least ${length} characters long`,
  DESCRIPTION_MAX_LENGTH: (length: number) => `Description must be at most ${length} characters long`,
}

export const CATEGORY_SUCCESS_MESSAGE = {
  GET_CATEGORIES: "Categories fetched",
  GET_CATEGORY: "Category fetched",
  CREATE_CATEGORY: "Category created",
  UPDATE_CATEGORY: "Category updated",
}
