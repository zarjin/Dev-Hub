import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  console.log("[auth.middleware] Authentication request received", {
    authorizationHeaderPresent: Boolean(authHeader),
  });

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("[auth.middleware] Missing or malformed Bearer authorization header");
    res.status(401).json({
      success: false,
      message: "Authentication token missing or invalid",
    });
    return;
  }

  const token = authHeader.slice(7).trim();

  console.log("[auth.middleware] Bearer token extracted", {
    tokenPresent: Boolean(token),
    tokenLength: token.length,
  });

  if (!token) {
    console.log("[auth.middleware] Bearer token is empty");
    res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    console.error("[auth.middleware] ACCESS_TOKEN_SECRET is not configured");
    res.status(500).json({
      success: false,
      message: "JWT secret is not configured",
    });
    return;
  }

  console.log("[auth.middleware] Verifying access token");

  try {
    const decoded = verifyToken(token, secret);

    if (!decoded || typeof decoded === "string") {
      console.log("[auth.middleware] Token payload is not an object");
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const userId =
      typeof decoded.id === "string"
        ? decoded.id
        : typeof decoded.id === "number" && Number.isSafeInteger(decoded.id)
          ? String(decoded.id)
          : undefined;

    if (!userId || typeof decoded.email !== "string") {
      console.log("[auth.middleware] Token payload is missing required claims", {
        idType: typeof decoded.id,
        emailType: typeof decoded.email,
      });
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    req.user = {
      id: userId,
      email: decoded.email,
    };

    console.log("[auth.middleware] Access token verified");
    next();
  } catch (error) {
    console.error("[auth.middleware] Access token verification failed", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
