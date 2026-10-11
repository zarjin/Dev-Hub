import type { RequestHandler } from "express";
import { z } from "zod";

type RequestTarget = "body" | "params" | "query";

export const validate = <TSchema extends z.ZodType>(
  schema: TSchema,
  target: RequestTarget = "body",
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    res.locals.validated = {
      ...(res.locals.validated ?? {}),
      [target]: result.data,
    };

    next();
  };
};
