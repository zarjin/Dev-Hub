import mongoose from "mongoose";

export const dbConnect = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const conn = await mongoose.connect(mongoUri);

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error: unknown) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
