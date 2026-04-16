import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate registering user in the database
    if (!body.phone) {
      return NextResponse.json({ success: false, message: "Phone number required" }, { status: 400 });
    }

    // Mock sending OTP
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully to " + body.phone,
      data: { verificationId: "V-" + Math.floor(Math.random() * 9999) }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
