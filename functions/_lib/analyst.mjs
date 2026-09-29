const DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfecADJc1sJ1H7JBFhqDhvQNdJ7AlDr-PQbD4LEERvEbK9fJXCYTtRl003F_kjkhYyJLaX480p8A_E/pub?gid=0&single=true&output=csv";
const SHEET_TTL_MS = 10 * 60 * 1000;
const ANSWER_TTL_MS = 30 * 60 * 1000;
const MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
const FRIENDLY_ERROR = "AI Analyst sedang tidak dapat digunakan. Silakan coba lagi.";
const INSUFFICIENT = "Data yang tersedia belum cukup untuk menentukan penyebabnya.";
const NO_ANOMALY = "Tidak ditemukan anomali yang signifikan berdasarkan data yang tersedia.";

const MONTH_TOKEN = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MEI: 5, MAY: 5,
  JUN: 6, JUL: 7, AGU: 8, AGS: 8, AUG: 8,
  SEP: 9, OKT: 10, OCT: 10, NOV: 11, DES: 12, DEC: 12,
};
const MONTH_LABEL = {
  1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun",
  7: "Jul", 8: "Ags", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des",
};

const sheetCache = { at: 0, url: "", kpis: null };
const answerCache = new Map();

function finite(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 0) {
  const number = finite(value);
  if (number == null) return null;
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

function growth(current, prior) {
  const now = finite(current);
  const before = finite(prior);
  if (now == null || before == null || before === 0) return null;
  return round(((now - before) / before) * 100, 1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const source = String(text).replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some((value) => String(value).trim() !== ""));
}

function toNumber(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let text = String(value).trim().replace(/Rp|IDR/gi, "").replace(/\s/g, "");
  if (!text || text === "-" || text === "—") return 0;
  const negative = text.startsWith("(") && text.endsWith(")");
  text = text.replace(/[()]/g, "");
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) text = text.replace(/\./g, "");
  else if (/^\d{1,3}(,\d{3})+$/.test(text)) text = text.replace(/,/g, "");
  else if (text.includes(",") && text.includes(".")) {
    text = text.lastIndexOf(",") > text.lastIndexOf(".")
      ? text.replace(/\./g, "").replace(",", ".")
      : text.replace(/,/g, "");
  } else text = text.replace(/,/g, "");
  const number = Number(text);
  if (!Number.isFinite(number)) return 0;
  return negative ? -Math.abs(number) : number;
}

function parseMonth(value) {
  const token = String(value).trim().replace(/\./g, "-").split("-")[0].toUpperCase().slice(0, 3);
  return MONTH_TOKEN[token] || null;
}

function mapColumns(header) {
  const index = {};
  header.forEach((name, i) => {
    const key = String(name).toUpperCase().replace(/\s+/g, " ").trim();
    if (key === "TAHUN" || key === "YEAR") index.tahun = i;
    else if (key === "BULAN" || key === "MONTH") index.bulan = i;
    else if (["NM_PLG", "PLATFORM", "CUSTOMER", "PELANGGAN"].includes(key)) index.platform = i;
    else if (["MERK", "BRAND", "MEREK"].includes(key)) index.brand = i;
    else if (["NM_BRG", "ITEM", "PRODUK", "PRODUCT"].includes(key)) index.item = i;
    else if (key.includes("BRUTTO") || ["OMSET", "NET SALES", "SALES", "REVENUE"].includes(key)) index.omset = i;
    else if (key.includes("QTY") || key.includes("QUANTITY") || key === "PCS") index.qty = i;
    else if (key.includes("TRANSAKSI") || key.includes("INVOICE") || key.includes("ORDER")) index.trx = i;
  });
  return index;
}

function rowsFromCsv(text) {
  const table = parseCsv(text);
  if (!table.length) return { rows: [], hasTransactions: false };
  const index = mapColumns(table[0]);
  const needed = ["tahun", "bulan", "platform", "brand", "item", "omset"];
  if (needed.some((key) => index[key] == null)) {
    throw new Error("Kolom CSV tidak lengkap.");
  }
  const rows = [];
  table.slice(1).forEach((line) => {
    const tahun = Number(line[index.tahun]);
    const month = parseMonth(line[index.bulan]);
    const omset = toNumber(line[index.omset]);
    const qty = index.qty == null ? 0 : toNumber(line[index.qty]);
    if (!Number.isFinite(tahun) || !month) return;
    if (omset === 0 && qty === 0) return;
    rows.push({
      tahun,
      month,
      ym: tahun * 12 + month,
      platform: String(line[index.platform] || "").trim() || "Tidak diketahui",
      brand: String(line[index.brand] || "").trim() || "Tidak diketahui",
      item: String(line[index.item] || "").trim() || "Tidak diketahui",
      omset,
      qty,
    });
  });
  return { rows, hasTransactions: index.trx != null };
}

function labelOf(ym) {
  const tahun = Math.floor((ym - 1) / 12);
  const month = ym - tahun * 12;
  return `${MONTH_LABEL[month]} ${String(tahun).slice(2)}`;
}

function sumRows(rows) {
  return rows.reduce((acc, row) => {
    acc.revenue += row.omset;
    acc.qty += row.qty;
    return acc;
  }, { revenue: 0, qty: 0 });
}

function groupSum(rows, keyFn) {
  const map = new Map();
  rows.forEach((row) => {
    const key = keyFn(row);
    const current = map.get(key) || { revenue: 0, qty: 0 };
    current.revenue += row.omset;
    current.qty += row.qty;
    map.set(key, current);
  });
  return map;
}

function money(value) {
  return round(value, 0);
}

function buildKpis(parsed) {
  const rows = parsed.rows;
  if (!rows.length) throw new Error("Sheet tidak berisi baris omset.");
  const maxYm = Math.max(...rows.map((row) => row.ym));
  const recentStart = maxYm - 11;
  const priorStart = maxYm - 23;
  const priorEnd = maxYm - 12;
  const recent = rows.filter((row) => row.ym >= recentStart && row.ym <= maxYm);
  const prior = rows.filter((row) => row.ym >= priorStart && row.ym <= priorEnd);
  const total = sumRows(rows);
  const recentTotal = sumRows(recent);
  const priorTotal = sumRows(prior);

  const byMonth = [...groupSum(rows, (row) => row.ym).entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([ym, value], index, list) => {
      const previous = index > 0 ? list[index - 1][1].revenue : null;
      return {
        label: labelOf(ym),
        revenue: money(value.revenue),
        qty: money(value.qty),
        mom_growth_pct: growth(value.revenue, previous),
      };
    });
  const monthly = byMonth.slice(-6);
  const last3 = byMonth.slice(-3).reduce((sum, row) => sum + row.revenue, 0);
  const prev3 = byMonth.slice(-6, -3).reduce((sum, row) => sum + row.revenue, 0);
  const trend3 = growth(last3, prev3);

  const byYear = [...groupSum(rows, (row) => row.tahun).entries()].sort((a, b) => a[0] - b[0]);
  const yearly = byYear.map(([year, value], index) => ({
    year,
    revenue: money(value.revenue),
    qty: money(value.qty),
    yoy_growth_pct: index > 0 ? growth(value.revenue, byYear[index - 1][1].revenue) : null,
  }));
  const currentYear = yearly[yearly.length - 1];
  const previousYear = yearly.length > 1 ? yearly[yearly.length - 2] : null;
  const lastMonth = byMonth[byMonth.length - 1];
  const previousMonth = byMonth.length > 1 ? byMonth[byMonth.length - 2] : null;

  function ranked(keyFn) {
    const now = groupSum(recent, keyFn);
    const before = groupSum(prior, keyFn);
    const names = new Set([...now.keys(), ...before.keys()]);
    const totalRevenue = recentTotal.revenue || 1;
    return [...names].map((name) => {
      const current = now.get(name) || { revenue: 0, qty: 0 };
      const old = before.get(name) || { revenue: 0, qty: 0 };
      return {
        name,
        revenue: money(current.revenue),
        qty: money(current.qty),
        contribution_pct: round((current.revenue / totalRevenue) * 100, 1),
        growth_pct: growth(current.revenue, old.revenue),
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }

  const platform = ranked((row) => row.platform);
  const brand = ranked((row) => row.brand).map((item, index) => ({ ...item, rank: index + 1 }));

  const itemNow = groupSum(recent, (row) => row.item);
  const itemBefore = groupSum(prior, (row) => row.item);
  const items = [...new Set([...itemNow.keys(), ...itemBefore.keys()])].map((name) => {
    const current = itemNow.get(name) || { revenue: 0, qty: 0 };
    const old = itemBefore.get(name) || { revenue: 0, qty: 0 };
    return {
      name,
      revenue: money(current.revenue),
      qty: money(current.qty),
      prior_revenue: money(old.revenue),
      growth_pct: growth(current.revenue, old.revenue),
    };
  });
  const withHistory = items.filter((item) => item.prior_revenue > 0 && item.revenue > 0 && item.growth_pct != null);

  return {
    currency: "IDR",
    period: {
      from: labelOf(Math.min(...rows.map((row) => row.ym))),
      to: labelOf(maxYm),
      comparison: `${labelOf(recentStart)}–${labelOf(maxYm)} vs ${labelOf(priorStart)}–${labelOf(priorEnd)}`,
    },
    notes: [
      parsed.hasTransactions
        ? "Kolom transaksi tersedia."
        : "Sheet tidak memiliki kolom transaksi, sehingga jumlah transaksi dan nilai rata-rata transaksi tidak dihitung.",
      "Tahun berjalan bisa belum setahun penuh. Pertumbuhan YoY tahun terakhir tidak disetahunkan.",
    ],
    overall: {
      total_revenue: money(total.revenue),
      total_qty: money(total.qty),
      total_transactions: null,
      average_transaction_value: null,
      recent_12m_revenue: money(recentTotal.revenue),
      prior_12m_revenue: money(priorTotal.revenue),
      growth_12m_pct: growth(recentTotal.revenue, priorTotal.revenue),
      last_month: lastMonth ? lastMonth.label : null,
      last_month_revenue: lastMonth ? lastMonth.revenue : null,
      mom_growth_pct: lastMonth && previousMonth ? growth(lastMonth.revenue, previousMonth.revenue) : null,
      current_year: currentYear ? currentYear.year : null,
      current_year_revenue: currentYear ? currentYear.revenue : null,
      previous_year: previousYear ? previousYear.year : null,
      previous_year_revenue: previousYear ? previousYear.revenue : null,
      yoy_growth_pct: currentYear && previousYear ? currentYear.yoy_growth_pct : null,
    },
    monthly,
    trend_3m: {
      last_3m_revenue: money(last3),
      previous_3m_revenue: money(prev3),
      growth_pct: trend3,
    },
    yearly,
    platform,
    brand,
    product: {
      window: `${labelOf(recentStart)}–${labelOf(maxYm)}`,
      top10_by_revenue: items.filter((item) => item.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
        .map(({ name, revenue, qty }) => ({ name, revenue, qty })),
      highest_growth: [...withHistory].sort((a, b) => b.growth_pct - a.growth_pct).slice(0, 5)
        .map(({ name, revenue, prior_revenue, growth_pct }) => ({ name, revenue, prior_revenue, growth_pct })),
      largest_decline: [...withHistory].sort((a, b) => a.growth_pct - b.growth_pct).slice(0, 5)
        .map(({ name, revenue, prior_revenue, growth_pct }) => ({ name, revenue, prior_revenue, growth_pct })),
      new_products: items.filter((item) => item.revenue > 0 && item.prior_revenue === 0)
        .sort((a, b) => b.revenue - a.revenue).slice(0, 5)
        .map(({ name, revenue, qty }) => ({ name, revenue, qty })),
      dead_products: items.filter((item) => item.revenue === 0 && item.prior_revenue > 0)
        .sort((a, b) => b.prior_revenue - a.prior_revenue).slice(0, 5)
        .map(({ name, prior_revenue }) => ({ name, prior_revenue })),
    },
  };
}

function selectContext(kpis, question) {
  const q = String(question || "").toLowerCase();
  const broad = !q || /analisis|ringkas|keseluruhan|overview|semua|laporan/.test(q);
  const context = {
    currency: kpis.currency,
    period: kpis.period,
    notes: kpis.notes,
    overall: kpis.overall,
  };
  const want = (pattern) => broad || pattern.test(q);
  if (want(/tren|bulan|mom|musim|turun|naik|drop|anjlok/)) {
    context.monthly = kpis.monthly;
    context.trend_3m = kpis.trend_3m;
  }
  if (want(/tahun|yoy|banding|compare|versus| vs |2023|2024|2025|2026/)) context.yearly = kpis.yearly;
  if (want(/platform|channel|kanal|shopee|tokopedia|semeru/)) context.platform = kpis.platform;
  if (want(/merek|brand|merk/)) context.brand = kpis.brand;
  if (want(/produk|item|sku|barang|baru|mati|dead/)) context.product = kpis.product;
  if (!context.monthly && !context.yearly && !context.platform && !context.brand && !context.product) {
    context.monthly = kpis.monthly;
    context.trend_3m = kpis.trend_3m;
    context.yearly = kpis.yearly;
    context.platform = kpis.platform;
    context.brand = kpis.brand;
    context.product = kpis.product;
  }
  return context;
}

function cacheKey(question, context) {
  const text = `${question}\n${JSON.stringify(context)}`;
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  return String(hash);
}

async function loadKpis(sheetUrl) {
  const url = sheetUrl || DEFAULT_SHEET_URL;
  if (sheetCache.kpis && sheetCache.url === url && Date.now() - sheetCache.at < SHEET_TTL_MS) {
    return sheetCache.kpis;
  }
  const response = await fetch(url, { headers: { accept: "text/csv" } });
  if (!response.ok) throw new Error("Sheet tidak dapat dibaca.");
  const kpis = buildKpis(rowsFromCsv(await response.text()));
  sheetCache.at = Date.now();
  sheetCache.url = url;
  sheetCache.kpis = kpis;
  return kpis;
}

function systemPrompt() {
  return [
    "You are an E-Commerce Data Analyst.",
    "Use ONLY the provided backend data. Do not make up numbers.",
    "Differentiate between factual data and hypothesis.",
    `If data is insufficient to explain a "why", you MUST state: "${INSUFFICIENT}"`,
    "Write the answer in Bahasa Indonesia.",
    "Return only JSON with keys summary, key_findings, trend_analysis, platform_analysis, brand_analysis, product_analysis, anomalies, possible_explanations, recommendations.",
    "key_findings, anomalies, possible_explanations, and recommendations are arrays of strings.",
    "possible_explanations must be hypotheses, not facts.",
    `If there is no clear anomaly, anomalies must be ["${NO_ANOMALY}"].`,
    "Amounts are Indonesian Rupiah. Do not invent transactions or average transaction value when those fields are null.",
  ].join("\n");
}

function normalizeResult(raw) {
  const text = (value) => (typeof value === "string" && value.trim() ? value.trim() : "");
  const list = (value) => (Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean).slice(0, 8) : []);
  const anomalies = list(raw && raw.anomalies);
  return {
    summary: text(raw && raw.summary),
    key_findings: list(raw && raw.key_findings),
    trend_analysis: text(raw && raw.trend_analysis),
    platform_analysis: text(raw && raw.platform_analysis),
    brand_analysis: text(raw && raw.brand_analysis),
    product_analysis: text(raw && raw.product_analysis),
    anomalies: anomalies.length ? anomalies : [NO_ANOMALY],
    possible_explanations: list(raw && raw.possible_explanations),
    recommendations: list(raw && raw.recommendations),
  };
}

async function askGemini(apiKey, question, context) {
  const key = cacheKey(question, context);
  const cached = answerCache.get(key);
  if (cached && Date.now() < cached.exp) return cached.value;
  const body = {
    systemInstruction: { parts: [{ text: systemPrompt() }] },
    contents: [{
      role: "user",
      parts: [{ text: `Pertanyaan:\n${question}\n\nData KPI:\n${JSON.stringify(context)}` }],
    }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };
  let lastError = null;
  for (const model of MODELS) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) {
        lastError = new Error(`Gemini ${model} ${response.status}`);
        continue;
      }
      const payload = await response.json();
      const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
      const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      const result = normalizeResult(JSON.parse(cleaned));
      answerCache.set(key, { at: Date.now(), exp: Date.now() + ANSWER_TTL_MS, value: result });
      return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Gemini tidak menjawab.");
}

export async function handleAnalystRequest(request, env) {
  try {
    const apiKey = String(env.apiKey || "").trim();
    if (!apiKey) {
      console.error("GEMINI_API_KEY tidak tersedia.");
      return { status: 503, body: { error: FRIENDLY_ERROR } };
    }
    const payload = await request.json();
    const question = String(payload.question || "").trim().slice(0, 500);
    if (!question) return { status: 400, body: { error: "Tuliskan pertanyaan untuk AI Analyst." } };
    const kpis = await loadKpis(env.sheetUrl);
    const context = selectContext(kpis, payload.full ? "" : question);
    const result = await askGemini(apiKey, question, context);
    return { status: 200, body: result };
  } catch (error) {
    console.error(error && error.message ? error.message : "Analyst error");
    return { status: 503, body: { error: FRIENDLY_ERROR } };
  }
}
