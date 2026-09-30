import { handleAnalystRequest } from "./functions/_lib/analyst.mjs";

const FRIENDLY_ERROR = "AI Analyst sedang tidak dapat digunakan. Silakan coba lagi.";
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/analyst" || url.pathname.endsWith("/api/analyst")) {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      if (request.method !== "POST") return json({ error: FRIENDLY_ERROR }, 405);
      const result = await handleAnalystRequest(request, {
        apiKey: env.GEMINI_API_KEY,
        sheetUrl: env.GOOGLE_SHEET_CSV_URL,
      });
      return json(result.body, result.status);
    }
    return env.ASSETS.fetch(request);
  },
};
