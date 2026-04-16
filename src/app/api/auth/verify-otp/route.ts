import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.verificationId || !body.otp) {
      return NextResponse.json({ success: false, message: "Invalid verification details" }, { status: 400 });
    }

    // Simulate OTP verification logic
    return NextResponse.json({ 
      success: true, 
      message: "Phone number verified successfully" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
