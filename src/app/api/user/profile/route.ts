import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return proxyToBackend({
    method: "GET",
    path: "/user/profile",
    request,
  });
}
