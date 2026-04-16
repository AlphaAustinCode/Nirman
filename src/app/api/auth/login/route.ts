import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.phone || !body.password) {
      return NextResponse.json({ success: false, message: "Phone and password are required" }, { status: 400 });
    }

    // Mock Login response
    return NextResponse.json({ 
      success: true, 
      message: "Login Successful",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
      user: {
        id: "usr_123",
        name: "Aditya Sanka",
        phone: body.phone,
        trustScore: 98
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
