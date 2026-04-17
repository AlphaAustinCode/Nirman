import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  return proxyToBackend({
    path: `/requests/${params.id}/respond`,
    body,
    request,
  });
}
