import { handleAnalystRequest } from "../_lib/analyst.mjs";

export async function onRequestPost(context) {
  const result = await handleAnalystRequest(context.request, {
    apiKey: context.env.GEMINI_API_KEY,
    sheetUrl: context.env.GOOGLE_SHEET_CSV_URL,
  });
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
