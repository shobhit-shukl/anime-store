import { connectDB } from "@/lib/mongodb";
import VerificationSchema from "@/models/Verification";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Static Admin Check (Optional: Add Environment Variable Fallback)
    // For now, we rely on DB, but ensures we only allow admins to even try.

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const conn = await connectDB("auth");
    const Verification = conn.model("Verification", VerificationSchema, "verification");

    const user = await Verification.findOne({ useremail: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // STRICT ADMIN CHECK
    if (user.userrole !== "admin") {
      return NextResponse.json(
        { message: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Verify Password
    let isMatch;
    if (user.password.startsWith('$')) {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } else {
      isMatch = cleanPassword === user.password;
    }

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Success: Set Cookie Session
    await setSession({ role: "admin", email: user.useremail });

    return NextResponse.json({
      message: "Login successful",
      role: "admin"
    }, { status: 200 });

  } catch (error: unknown) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
