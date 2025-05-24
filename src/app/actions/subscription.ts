"use server";

import { cookies } from "next/headers";

export async function subscribeToPremium() {
  try {
    // Set premium cookie server-side
    const cookieStore = await cookies();
    cookieStore.set("premium", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return {
      success: true,
      message: "Successfully subscribed to premium",
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      message: "Failed to subscribe to premium",
    };
  }
}
