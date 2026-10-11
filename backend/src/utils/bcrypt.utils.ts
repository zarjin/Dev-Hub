import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  try {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("hashPassword Error:", error);
    throw new Error("password Hashing Error");
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("comparePassword Error:", error);
    throw new Error("password comparing Error");
  }
};
