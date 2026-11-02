import JWT from "jsonwebtoken";

export const generateAccessToken = (payload: object) => {
  try {
    const token = JWT.sign(
      payload,
      process.env["ACCESS_TOKEN_SECRET"] as string,
    );
    return token;
  } catch (err) {
    console.error("Error generating access token:", err);
    throw new Error("Error generating access token");
  }
};

export const generateRefreshToken = (payload: object) => {
  try {
    const token = JWT.sign(
      payload,
      process.env["REFRESH_TOKEN_SECRET"] as string,
    );
    return token;
  } catch (err) {
    console.error("Error generating refresh token:", err);
    throw new Error("Error generating refresh token");
  }
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = JWT.verify(
      token,
      process.env["ACCESS_TOKEN_SECRET"] as string,
    );
    return decoded;
  } catch (err) {
    console.error("Error verifying access token:", err);
    throw new Error("Error verifying access token");
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = JWT.verify(
      token,
      process.env["REFRESH_TOKEN_SECRET"] as string,
    );
    return decoded;
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    throw new Error("Error verifying refresh token");
  }
};
