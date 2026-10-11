import JWT from "jsonwebtoken";

//Access Token
export const generateAccessToken = (payload: object, secret: string) => {
  try {
    return JWT.sign(payload, secret, {
      expiresIn: "15m",
    });
  } catch (error) {
    console.error("JWT Signing Error:", error);
    throw new Error("Failed to generate access token.");
  }
};

export const verifyAccessToken = (token: string, secret: string) => {
  try {
    return JWT.verify(token, secret);
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify Access Token");
  }
};

//Refresh Token
export const generateRefreshToken = (payload: object, secret: string) => {
  try {
    return JWT.sign(payload, secret, {
      expiresIn: "15m",
    });
  } catch (error) {
    console.error("JWT Signing Error:", error);
    throw new Error("Failed to generate refresh token.");
  }
};

export const verifyRefreshToken = (token: string, secret: string) => {
  try {
    return JWT.verify(token, secret);
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify refresh token.");
  }
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return JWT.verify(token, secret);
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify Token");
  }
};
