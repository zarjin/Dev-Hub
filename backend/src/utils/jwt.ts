import JWT from "jsonwebtoken";
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return JWT.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return JWT.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string) => {
  return JWT.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return JWT.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET as string);
};
