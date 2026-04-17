import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend({
    path: `/notifications/${params.id}/read`,
    body: {},
    request,
  });
}
