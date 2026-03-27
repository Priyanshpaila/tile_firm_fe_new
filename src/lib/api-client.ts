import { API_BASE_URL } from "./constants";

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status = 500, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  isFormData?: boolean;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String((data as { message?: string }).message || "Request failed")
        : typeof data === "string"
          ? data
          : "Request failed";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { body, isFormData, headers, ...rest } = options;
  const requestHeaders = new Headers(headers || {});
  let payload: BodyInit | undefined;

  if (body !== undefined && body !== null) {
    if (isFormData) {
      payload = body as FormData;
    } else {
      requestHeaders.set("Content-Type", "application/json");
      payload = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...rest,
    headers: requestHeaders,
    body: payload,
    cache: "no-store"
  });

  return parseResponse<T>(response);
}
