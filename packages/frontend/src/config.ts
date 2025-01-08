export const BACKEND_URL = process.env.BACKEND_URL || "http://webapp.api";

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}
