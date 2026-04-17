import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyToBackend({
    method: "GET",
    path: `/listings${query ? `?${query}` : ""}`,
    request,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyToBackend({
    path: "/listings",
    body,
    request,
  });
}
