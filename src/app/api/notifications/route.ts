import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  return proxyToBackend({
    method: "GET",
    path: `/notifications${query ? `?${query}` : ""}`,
    request,
  });
}
