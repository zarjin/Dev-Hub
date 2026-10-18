import JWT from "jsonwebtoken";

//Access Token
export const generateAccessToken = (payload: object, secret: string) => {
  try {
    const token = JWT.sign(payload, secret, {
      expiresIn: "7d",
    });
    console.log("[jwt] Access token generated");
    return token;
  } catch (error) {
    console.error("JWT Signing Error:", error);
    throw new Error("Failed to generate access token.");
  }
};

export const verifyAccessToken = (token: string, secret: string) => {
  try {
    const decoded = JWT.verify(token, secret);
    console.log("[jwt] Access token verified");
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify Access Token");
  }
};

//Refresh Token
export const generateRefreshToken = (payload: object, secret: string) => {
  try {
    const token = JWT.sign(payload, secret, {
      expiresIn: "7d",
    });
    console.log("[jwt] Refresh token generated");
    return token;
  } catch (error) {
    console.error("JWT Signing Error:", error);
    throw new Error("Failed to generate refresh token.");
  }
};

export const verifyRefreshToken = (token: string, secret: string) => {
  try {
    const decoded = JWT.verify(token, secret);
    console.log("[jwt] Refresh token verified");
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify refresh token.");
  }
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = JWT.verify(token, secret);
    console.log("[jwt] Token verified");
    return decoded;
  } catch (error) {
    console.error("JWT Verify Error:", error);
    throw new Error("Failed to Verify Token");
  }
};
