import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import VerificationSchema from "@/models/Verification";
import bcrypt from "bcryptjs";

// USAGE: npx tsx scripts/create-admin.ts <email> <password>

async function createAdmin() {
    // Dynamic import to avoid top-level env check in lib/mongodb.ts
    const { connectDB } = await import("@/lib/mongodb");

    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
        process.exit(1);
    }

    const [email, password] = args;

    try {
        const conn = await connectDB("auth");
        if (!conn) throw new Error("DB Connection failed");

        const Verification = conn.model("Verification", VerificationSchema, "verification");

        // Check existing
        const existing = await Verification.findOne({ useremail: email });
        if (existing) {
            console.log(`User ${email} already exists. Updating to admin...`);
            existing.userrole = "admin";
            existing.password = await bcrypt.hash(password, 12);
            await existing.save();
            console.log("✅ Updated successfully.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newAdmin = new Verification({
                useremail: email,
                password: hashedPassword,
                userrole: "admin",
            });
            await newAdmin.save();
            console.log(`✅ Admin ${email} created successfully.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
}

createAdmin();
