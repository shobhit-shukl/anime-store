import mongoose from "mongoose";


export async function connectDB(dbName: string = "auth") {
  const MONGODB_URI = process.env.MONGODB_URI;

  // Safety Check: This will show in your terminal if the .env isn't working
  if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is undefined. Check your .env.local file.");
    return;
  }

  // Create a unique connection for each database
  const connectionKey = `connection_${dbName}`;
  if (mongoose.connections.find(conn => conn.name === dbName && conn.readyState === 1)) {
    return mongoose.connections.find(conn => conn.name === dbName);
  }

  try {
    const conn = await mongoose.createConnection(MONGODB_URI, {
      dbName: dbName,
    });
    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed for ${dbName}:`, error);
  }
}