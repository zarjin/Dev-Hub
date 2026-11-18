import argon from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await argon.hash(password);

  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const comparedPassword = await argon.verify(hash, password);
  return comparedPassword;
};
