export const BACKEND_URL = process.env.BACKEND_URL || "http://backend.default.svc.cluster.local:5000";

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}
