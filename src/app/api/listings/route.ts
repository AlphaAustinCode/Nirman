import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.availabilityTime || !body.price) {
      return NextResponse.json({ success: false, message: "Availability and price are required." }, { status: 400 });
    }

    // Mock inserting a new sharing listing into the DB
    return NextResponse.json({ 
      success: true, 
      message: "Cylinder sharing listing created successfully! It is now visible to nearby users.",
      listingId: "LST-" + Math.floor(Math.random() * 10000)
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
