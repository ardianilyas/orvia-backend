import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  /**
   * Zod Validation Error
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  /**
   * Custom App Error
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  /**
   * PostgreSQL/Drizzle Database Errors
   */
  if (err instanceof Error && err.cause && typeof err.cause === "object" && "code" in err.cause) {
    const pgError = err.cause as { code: string; detail?: string };

    // 23505: unique violation
    if (pgError.code === "23505") {
      return res.status(400).json({
        success: false,
        message: pgError.detail || "Record already exists",
      });
    }

    // 23503: foreign key violation
    if (pgError.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Referenced record does not exist",
      });
    }

    // 23502: not null violation
    if (pgError.code === "23502") {
      return res.status(400).json({
        success: false,
        message: pgError.detail || "Required field is missing",
      });
    }
  }

  /**
   * Unknown Error
   */
  return res.status(500).json({
    success: false,
    message: err.message ?? "Internal Server Error",
  });
};