import type { Report } from "~/lib/report";

export async function request(method: string, path: string, body?: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "text/plain",
    },
    body,
  });

  if (!response.ok) {
    console.error(response);
    throw new Error(`Request failed`);
  }

  return (await response.json()) as Report;
}
