import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Returns mock history data
  const historyData = [
    {
      id: "REQ-001",
      date: "2026-04-12",
      type: "Received",
      counterparty: "Ramesh Kumar",
      status: "COMPLETED",
      amount: "₹0"
    },
    {
      id: "REQ-002",
      date: "2026-03-28",
      type: "Sent",
      counterparty: "Anita Sharma",
      status: "COMPLETED",
      amount: "₹0"
    },
    {
      id: "REQ-003",
      date: "2026-04-15",
      type: "Received",
      counterparty: "Sunita Yadav",
      status: "PENDING",
      amount: "Exchange"
    }
  ];

  return NextResponse.json({ success: true, count: historyData.length, data: historyData }, { status: 200 });
}
