import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = async (schema: z.ZodType) => {
  return (req: Request, res: Response, Next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    req.body = result.data;
    Next();
  };
};
