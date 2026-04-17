import { proxyToBackend } from "@/lib/backend-api";

export async function POST(request: Request) {
  const body = await request.json();

  return proxyToBackend({
    path: "/validate-agency",
    body,
  });
}
