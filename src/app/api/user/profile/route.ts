import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Returns mock profile data for the Dashboard
  const profileData = {
    id: "usr_123",
    name: "Aditya Sanka",
    location: "Sector 12, Noida",
    trustScore: 98,
    activeRequests: 1,
    cylindersShared: 3,
    walletBalance: "₹150",
    joinDate: "2026-01-15"
  };

  return NextResponse.json({ success: true, data: profileData }, { status: 200 });
}
