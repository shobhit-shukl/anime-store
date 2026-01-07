import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongooseCaches: Map<string, MongooseCache> | undefined;
}

let caches = global.mongooseCaches;

if (!caches) {
  caches = global.mongooseCaches = new Map();
}

export async function connectDB(dbName: string = "anime_store") {
  let cached = caches!.get(dbName);

  if (!cached) {
    cached = { conn: null, promise: null };
    caches!.set(dbName, cached);
  }

  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: dbName,
    };

    // Use createConnection for multiple databases
    cached.promise = Promise.resolve(mongoose.createConnection(MONGODB_URI!, opts));
    console.log(`📡 Initializing connection for: ${dbName}`);
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn.readyState !== 1) {
      await new Promise((resolve, reject) => {
        cached!.conn!.once('open', resolve);
        cached!.conn!.once('error', reject);
      });
    }
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}
