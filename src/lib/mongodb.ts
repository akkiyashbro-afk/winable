import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let cached = globalThis as typeof globalThis & {
  mongooseConn: mongoose.Connection | null;
};

if (!cached.mongooseConn) {
  cached.mongooseConn = null;
}

export async function getMongooseConnection(): Promise<mongoose.Connection> {
  if (cached.mongooseConn && cached.mongooseConn.readyState === 1) {
    return cached.mongooseConn;
  }

  if (!MONGODB_URI) {
    console.error("[mongodb] MONGODB_URI is EMPTY or undefined");
    throw new Error(
      "MONGODB_URI environment variable is not set. " +
      "Add it to your .env file and to Vercel Production environment variables.",
    );
  }

  const uriLength = MONGODB_URI.length;
  console.log(`[mongodb] MONGODB_URI present (${uriLength} chars), connecting...`);

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 8000,
    });
    console.log(`[mongodb] Connected successfully to ${conn.connection.host}`);
    cached.mongooseConn = conn.connection;
    return cached.mongooseConn;
  } catch (err: any) {
    cached.mongooseConn = null;
    const msg = err?.message || String(err);
    if (msg.includes("ETIMEOUT") || msg.includes("ECONNREFUSED") || msg.includes("timeout")) {
      throw new Error(
        "MongoDB connection timed out. " +
        "This usually means MongoDB Atlas IP Access List does not include your server's IP. " +
        "Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0).",
      );
    }
    if (msg.includes("bad auth") || msg.includes("Authentication failed") || msg.includes("auth")) {
      throw new Error(
        "MongoDB authentication failed. Check that MONGODB_URI username and password are correct.",
      );
    }
    throw new Error(`MongoDB connection failed: ${msg}`);
  }
}
