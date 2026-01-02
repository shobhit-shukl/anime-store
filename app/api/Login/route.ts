import { connectDB } from "@/lib/mongodb";
import VerificationSchema from "@/models/Verification";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Extract and sanitize the input
    const { email, password } = await req.json();
    
    // Extra server-side safety: trim and lowercase
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { message: "Email and password are required" }, 
        { status: 400 }
      );
    }

    // 2. Connect to the Database
    const conn = await connectDB("auth");
    if (!conn) {
      return NextResponse.json(
        { message: "Database connection failed" },
        { status: 500 }
      );
    }

    const Verification = conn.model("Verification", VerificationSchema, "verification");

    // 3. Find the user in the 'verification' collection
    const user = await Verification.findOne({ useremail: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" }, 
        { status: 404 }
      );
    }

    // 4. Compare the provided password with the password in DB
    // Check if password is hashed (bcrypt hashes start with $)
    let isMatch;
    if (user.password.startsWith('$')) {
      // Hashed password
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } else {
      // Plain text password (for backward compatibility)
      isMatch = cleanPassword === user.password;
    }

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" }, 
        { status: 401 }
      );
    }

    // 5. Success! Return the user role to the frontend
    return NextResponse.json({ 
      message: "Login successful", 
      role: user.userrole 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}