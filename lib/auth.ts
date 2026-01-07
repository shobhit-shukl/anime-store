import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "fallback_secret_key_change_me_in_prod";
const key = new TextEncoder().encode(SECRET_KEY);

export async function signJWT(payload: any, expiresIn: string = "24h") {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function setSession(user: { role: string; email: string }) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const token = await signJWT(user, "24h");

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await verifyJWT(token);
}
