import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleAnalystRequest } from "./functions/_lib/analyst.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8788);

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq < 1) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === "") process.env[key] = value;
  });
}

loadEnv(path.join(root, ".env"));

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function isPublicFile(urlPath) {
  if (urlPath.includes("..") || urlPath.startsWith("/functions") || urlPath.startsWith("/server.js")) return false;
  if (urlPath === "/.env" || urlPath.endsWith("/.env")) return false;
  return Object.prototype.hasOwnProperty.call(types, path.extname(urlPath).toLowerCase());
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
  if (url.pathname === "/api/analyst" && req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const request = new Request("http://local/api/analyst", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: Buffer.concat(chunks).toString("utf8"),
    });
    const result = await handleAnalystRequest(request, {
      apiKey: process.env.GEMINI_API_KEY,
      sheetUrl: process.env.GOOGLE_SHEET_CSV_URL,
    });
    res.writeHead(result.status, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(result.body));
    return;
  }
  let urlPath = decodeURIComponent(url.pathname);
  if (urlPath === "/") urlPath = "/index.html";
  if (!isPublicFile(urlPath)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const file = path.resolve(root, urlPath.replace(/^\/+/, ""));
  const relativeToRoot = path.relative(root, file);
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file).toLowerCase()] });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AI Analyst lokal: http://127.0.0.1:${port}/`);
});
