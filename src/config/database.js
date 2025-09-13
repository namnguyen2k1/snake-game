import mongoose, { connect } from "mongoose";

export const connectDatabase = async () => {
  try {
    const dbName = process.env.DB_NAME ?? "snake-game";
    const uri = process.env.DB_URL ?? `mongodb://localhost:27017/${dbName}`;

    await connect(uri).then(() => {
      mongoose.set("debug", true);
      console.log(`MongoDB connected: ${uri}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export const DB_COLLECTION = {
  USER: "users",
  MATCH: "matches",
};
