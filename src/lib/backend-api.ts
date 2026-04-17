import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl =
  process.env.BACKEND_API_URL || "http://127.0.0.1:5000/api";

type ProxyOptions = {
  method?: "GET" | "POST";
  path: string;
  body?: unknown;
  request?: NextRequest;
  headers?: Record<string, string>;
};

export async function proxyToBackend({
  method = "POST",
  path,
  body,
  request,
  headers = {},
}: ProxyOptions) {
  const targetUrl = `${backendBaseUrl}${path}`;
  const outgoingHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  const authorization = request?.headers.get("authorization");
  if (authorization) {
    outgoingHeaders.Authorization = authorization;
  }

  const response = await fetch(targetUrl, {
    method,
    headers: outgoingHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: response.ok,
        message: text,
      };
    }
  }

  return NextResponse.json(data, { status: response.status });
}
