import { proxyToBackend } from "@/lib/backend-api";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyToBackend({
    method: "DELETE",
    path: `/listings/${params.id}`,
    request,
  });
}
