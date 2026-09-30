import { handleAnalystRequest } from "./functions/_lib/analyst.mjs";

const FRIENDLY_ERROR = "AI Analyst sedang tidak dapat digunakan. Silakan coba lagi.";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/analyst") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: FRIENDLY_ERROR }), {
          status: 405,
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }
      const result = await handleAnalystRequest(request, {
        apiKey: env.GEMINI_API_KEY,
        sheetUrl: env.GOOGLE_SHEET_CSV_URL,
      });
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
