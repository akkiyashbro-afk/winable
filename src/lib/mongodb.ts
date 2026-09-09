import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let cached = globalThis as typeof globalThis & {
  mongooseConn: mongoose.Connection | null;
};

if (!cached.mongooseConn) {
  cached.mongooseConn = null;
}

export async function getMongooseConnection(): Promise<mongoose.Connection> {
  if (cached.mongooseConn) {
    return cached.mongooseConn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const conn = await mongoose.connect(MONGODB_URI);
  cached.mongooseConn = conn.connection;
  return cached.mongooseConn;
}
