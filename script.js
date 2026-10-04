window.PRESENTATION_DATA = {"source_file": "DATA E-COM.xlsx", "top_platform": {"name": "PT. Shopee International", "value": 1820979900.0, "label": "Rp 1,82 Miliar"}, "top_brand": {"name": "BANANA BOAT", "value": 1710855000.0, "label": "Rp 1,71 Miliar"}, "top_item": {"name": "Sport SPF 50 90ML", "value": 430768000.0, "label": "Rp 0,43 Miliar"}, "trend": {"labels": ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "Mei 24", "Jun 24", "Jul 24", "Ags 24", "Sep 24", "Okt 24", "Nov 24", "Des 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "Mei 25", "Jun 25", "Jul 25", "Ags 25", "Sep 25", "Okt 25", "Nov 25", "Des 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "Mei 26", "Jun 26", "Jul 26", "Ags 26", "Sep 26"], "actual": [35245800.0, 105575200.0, 175568100.0, 141435900.0, 226346400.0, 334026100.0, 267281400.0, 380722400.0, 529964600.0, 221942300.0, 182773000.0, 273895600.0, 86368200.0, 214634700.0, 404713600.0, 367952600.0, 505570200.0, 281467600.0, 239891400.0, 190911600.0, 366950500.0, 306052400.0, 201038700.0, 155586400.0, 441309400.0, 167267300.0, 97305700.0, 469761000.0, 258296500.0, 326637200.0, 404638400.0, 370634700.0, null], "forecast": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 370634700.0, 437966053.0], "last_actual_label": "Ags 26", "last_actual_value": 370634700.0, "last_actual_text": "Rp 370.634.700", "forecast_label": "Sep 26", "forecast_value": 437966053.0, "forecast_text": "Rp 437.966.053", "growth_pct": 18}, "platforms": [{"name": "Shopee", "full_name": "PT. Shopee International", "value": 7604759700.0, "pct": 80}, {"name": "Tokopedia", "full_name": "PT. Tokopedia", "value": 1061881900.0, "pct": 11}, {"name": "Mitra Semeru", "full_name": "PT. Mitra Semeru", "value": 846417800.0, "pct": 9}], "brands": [{"name": "Banana Boat", "value": 6810241600.0, "value_miliar": 6.81, "label": "Rp 6,81 Miliar"}, {"name": "Intuition", "value": 2328481500.0, "value_miliar": 2.33, "label": "Rp 2,33 Miliar"}, {"name": "Schick", "value": 592677100.0, "value_miliar": 0.59, "label": "Rp 0,59 Miliar"}], "insights": [{"title": "Alokasi Budget Marketing", "body": "Alokasi Budget Marketing: Mengingat prediksi lonjakan omset ke Rp 437 Juta di bulan September, tingkatkan budget ads di Shopee khusus untuk produk Sport SPF 50."}, {"title": "Fokus Promosi Item Menurun", "body": "Fokus Promosi Item Menurun: Arahkan program promosi ke item dengan tren penurunan penjualan. Utamakan item yang ditandai latar merah, karena item tersebut juga masuk daftar Top 10."}, {"title": "Optimasi Mitra Semeru", "body": "Optimasi Mitra Semeru: Lakukan kampanye co-branding atau diskon khusus untuk menaikkan penetrasi pasar di Mitra Semeru, kanal aktif berikutnya dengan kinerja terendah setelah Tokopedia ditutup."}, {"title": "Manajemen Inventaris", "body": "Manajemen Inventaris: Amankan stok produk 'Simply Protect Kids' dan 'Sport SPF 50' menjelang peak season akhir tahun. Selalu jaga dan amankan buffer stok, terutama untuk item Top 10, agar tidak terjadi kekosongan stok."}]};
    const D = window.PRESENTATION_DATA;
    const IDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    const IDR_SHORT = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

    function setText(id, value) {
      const el = document.getElementById(id);
      if (el && value != null) el.textContent = value;
    }

    const trend = D.trend || {};
    let labels = trend.labels || [];
    let actual = (trend.actual || []).map((v) => (v == null ? null : Number(v)));
    let forecast = (trend.forecast || []).map((v) => (v == null ? null : Number(v)));
    let lastActualIdx = actual.reduce((acc, v, i) => (v != null ? i : acc), -1);
    let forecastIdx = forecast.length - 1;
    const growthPct = trend.growth_pct != null ? trend.growth_pct : 18;
    const platforms = D.platforms || [];
    const brands = D.brands || [];

    if (D.top_platform) {
      setText("topPlatformName", D.top_platform.name);
      setText("topPlatformValue", D.top_platform.label);
      setText("chipPlatform", D.top_platform.name + " · Lead Channel");
    }
    if (D.top_brand) {
      setText("topBrandName", D.top_brand.name);
      setText("topBrandValue", D.top_brand.label);
      setText("chipBrand", D.top_brand.name + " · Lead Brand");
    }
    if (D.top_item) {
      setText("topItemName", D.top_item.name);
      setText("topItemValue", D.top_item.label);
    }
    setText("chipForecast", "Forecast Sep 2026 +" + growthPct + "%");
    setText("trendCaption", (trend.last_actual_label || "Ags 26") + ": " + (trend.last_actual_text || "") + " · Forecast Sep +" + growthPct + "%");
    setText("forecastHighlight", "September 2026: " + (trend.forecast_text || "Rp 437.966.053"));
    setText("forecastGrowth", "+" + growthPct + "%");
    setText("platformCaption", platforms.map((p) => p.name + " " + p.pct + "%").join(" · "));
    setText("brandCaption", brands.map((b) => b.name + " " + String(b.value_miliar).replace(".", ",") + "M").join(" · "));
    setText("sourceFile", D.source_file || "DATA E-COM.xlsx");
    (D.insights || []).forEach((item, i) => {
      setText("insightTitle" + i, item.title);
      setText("insightBody" + i, item.body);
    });

    const chartDefaults = {
      color: "#475569",
      borderColor: "rgba(148,163,184,0.16)",
      font: { family: "Outfit", size: 11 },
    };

    Chart.defaults.color = chartDefaults.color;
    Chart.defaults.font.family = chartDefaults.font.family;
    Chart.defaults.animation.duration = 1500;
    Chart.defaults.animation.easing = "easeOutQuart";

    const tooltipTheme = {
      backgroundColor: "rgba(255, 255, 255, 0.96)",
      titleColor: "#8A6D1F",
      bodyColor: "#1E293B",
      borderColor: "rgba(15, 39, 68, 0.12)",
      borderWidth: 1,
      padding: 12,
      displayColors: true,
    };

    const initialized = {};

    function buildTrendChart() {
      const ctx = document.getElementById("trendChart");
      const pointColors = actual.map((_, i) => (i === lastActualIdx ? "#D4AF37" : "transparent"));
      const pointRadius = actual.map((_, i) => (i === lastActualIdx ? 7 : 0));
      const pointBorder = actual.map((_, i) => (i === lastActualIdx ? "#F8FAFC" : "transparent"));
      const forecastRadius = forecast.map((_, i) => (i === lastActualIdx ? 5 : (i === forecastIdx ? 8 : 0)));

      return new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Aktual",
              data: actual,
              borderColor: "#2DD4BF",
              backgroundColor: "rgba(45, 212, 191, 0.10)",
              fill: true,
              tension: 0.35,
              borderWidth: 2.4,
              pointRadius,
              pointHoverRadius: 6,
              pointBackgroundColor: pointColors,
              pointBorderColor: pointBorder,
              pointBorderWidth: 2,
              spanGaps: false,
            },
            {
              label: "Forecast Sep 2026",
              data: forecast,
              borderColor: "#D4AF37",
              backgroundColor: "#E8D48B",
              borderDash: [7, 5],
              tension: 0.25,
              borderWidth: 2.2,
              pointRadius: forecastRadius,
              pointHoverRadius: 7,
              pointBackgroundColor: ["#D4AF37", "#E8D48B"],
              spanGaps: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1500, easing: "easeOutQuart" },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipTheme,
              callbacks: {
                label(ctx) {
                  if (ctx.raw == null) return "";
                  const tag = ctx.datasetIndex === 1 && ctx.dataIndex === forecastIdx ? " (Projected +" + growthPct + "%)" : "";
                  return " " + IDR.format(ctx.raw) + tag;
                },
              },
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(148,163,184,0.06)" },
              ticks: { maxTicksLimit: 12, color: "#475569" },
            },
            y: {
              grid: { color: "rgba(148,163,184,0.08)" },
              ticks: {
                color: "#475569",
                callback(value) {
                  return "Rp " + IDR_SHORT.format(value / 1e6) + " jt";
                },
              },
            },
          },
        },
      });
    }

    function buildPlatformChart() {
      const ctx = document.getElementById("platformChart");
      return new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: platforms.map((p) => p.name + " " + p.pct + "%"),
          datasets: [{
            data: platforms.map((p) => p.pct),
            backgroundColor: ["#D4AF37", "#2DD4BF", "#64748B"],
            borderColor: "#FFFFFF",
            borderWidth: 3,
            hoverOffset: 8,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1500, animateRotate: true, animateScale: true },
          cutout: "68%",
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#334155", padding: 16, usePointStyle: true, pointStyle: "circle" },
            },
            tooltip: {
              ...tooltipTheme,
              callbacks: { label(ctx) { return " " + ctx.label; } },
            },
          },
        },
      });
    }

    function buildBrandChart() {
      const ctx = document.getElementById("brandChart");
      return new Chart(ctx, {
        type: "bar",
        data: {
          labels: brands.map((b) => b.name),
          datasets: [{
            label: "Omset (Miliar)",
            data: brands.map((b) => b.value_miliar),
            backgroundColor: ["rgba(212,175,55,0.88)", "rgba(45,212,191,0.82)", "rgba(100,116,139,0.85)"],
            borderColor: ["#D4AF37", "#2DD4BF", "#94A3B8"],
            borderWidth: 1,
            borderRadius: 10,
            barThickness: 46,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1500, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipTheme,
              callbacks: {
                label(ctx) {
                  const row = brands[ctx.dataIndex];
                  return " " + (row ? row.label : "");
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#1E293B" } },
            y: {
              beginAtZero: true,
              grid: { color: "rgba(148,163,184,0.08)" },
              ticks: {
                color: "#475569",
                callback(value) { return value + " M"; },
              },
            },
          },
        },
      });
    }

    const brandYearLabels = ["Banana Boat", "Intuition", "Schick", "Freeman"];
    const brandYearSeries = {
      "2024": [1.963, 0.667, 0.208, 0.037],
      "2025": [2.129, 0.833, 0.184, 0.109],
      "2026": [1.711, 0.627, 0.145, 0.053],
    };

    function formatBrandGrowth(current, prior) {
      if (!prior) return "";
      const ratio = (current - prior) / prior;
      const text = Math.abs(ratio * 100).toFixed(1).replace(".", ",");
      return (ratio < 0 ? "−" : "+") + text + "%";
    }

    const brandYearGrowthPlugin = {
      id: "brandYearGrowth",
      afterDatasetsDraw(chart) {
        const years = Object.values(brandYearSeries);
        const { ctx } = chart;
        const narrow = chart.width < 800;
        const fontSize = narrow ? 9 : 11;
        ctx.save();
        ctx.font = "600 " + fontSize + "px Outfit, sans-serif";
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          if (datasetIndex === 0) return;
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta.hidden) return;
          meta.data.forEach((bar, index) => {
            const label = formatBrandGrowth(years[datasetIndex][index], years[datasetIndex - 1][index]);
            if (!label) return;
            ctx.fillStyle = label.charAt(0) === "−" ? "#991B1B" : "#0F766E";
            ctx.save();
            if (narrow) {
              ctx.translate(bar.x, bar.y - 3);
              ctx.rotate(-Math.PI / 2);
              ctx.textAlign = "left";
              ctx.textBaseline = "middle";
              ctx.fillText(label, 0, 0);
            } else {
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              ctx.fillText(label, bar.x, bar.y - 4);
            }
            ctx.restore();
          });
        });
        ctx.restore();
      },
    };

    function buildBrandYearChart() {
      const ctx = document.getElementById("brandYearChart");
      const palette = ["#0F766E", "#D4AF37", "#334155"];
      return new Chart(ctx, {
        type: "bar",
        plugins: [brandYearGrowthPlugin],
        data: {
          labels: brandYearLabels,
          datasets: Object.entries(brandYearSeries).map(([year, data], index) => ({
            label: year,
            data,
            backgroundColor: palette[index],
            borderRadius: 8,
            maxBarThickness: 28,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 22 } },
          animation: { duration: 1500, easing: "easeOutQuart" },
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#334155", padding: 16, usePointStyle: true, pointStyle: "circle" },
            },
            tooltip: {
              ...tooltipTheme,
              callbacks: {
                label(ctx) {
                  return " " + ctx.dataset.label + ": Rp " + String(ctx.raw).replace(".", ",") + " Miliar";
                },
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#1E293B" } },
            y: {
              beginAtZero: true,
              grace: "24%",
              grid: { color: "rgba(148,163,184,0.2)" },
              ticks: {
                color: "#475569",
                callback(value) { return value + " M"; },
              },
            },
          },
        },
      });
    }

    function platformShortName(name) {
      const text = String(name || "").toUpperCase();
      if (text.includes("SHOPEE")) return "Shopee";
      if (text.includes("TOKOPEDIA")) return "Tokopedia";
      if (text.includes("SEMERU")) return "Mitra Semeru";
      if (text.includes("ALFA")) return "Alfa Gift";
      if (text.includes("BERHASIL")) return "Berhasil Tumbuh";
      if (text.includes("LAZADA")) return "Lazada";
      if (text.includes("BLIBLI")) return "Blibli";
      return name;
    }

    function parseSheetCsv(source) {
      const rows = [];
      let row = [];
      let cell = "";
      let quoted = false;
      const input = String(source).replace(/^\uFEFF/, "");
      for (let i = 0; i < input.length; i += 1) {
        const ch = input[i];
        if (quoted) {
          if (ch === '"') {
            if (input[i + 1] === '"') {
              cell += '"';
              i += 1;
            } else quoted = false;
          } else cell += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ",") {
          row.push(cell);
          cell = "";
        } else if (ch === "\n") {
          row.push(cell);
          rows.push(row);
          row = [];
          cell = "";
        } else if (ch !== "\r") cell += ch;
      }
      if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
      }
      return rows.filter((item) => item.some((value) => String(value).trim() !== ""));
    }

    function sheetAmount(value) {
      let text = String(value || "").trim().replace(/Rp|IDR/gi, "").replace(/\s/g, "");
      if (!text || text === "-" || text === "—") return 0;
      if (/^\d{1,3}(\.\d{3})+$/.test(text)) text = text.replace(/\./g, "");
      else if (/^\d{1,3}(,\d{3})+$/.test(text)) text = text.replace(/,/g, "");
      else text = text.replace(/,/g, "");
      const number = Number(text);
      return Number.isFinite(number) ? number : 0;
    }

    const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTfecADJc1sJ1H7JBFhqDhvQNdJ7AlDr-PQbD4LEERvEbK9fJXCYTtRl003F_kjkhYyJLaX480p8A_E/pub?output=csv";

    let sheetCsvPromise = null;

    function loadSheetCsvText() {
      if (sheetCsvPromise) return sheetCsvPromise;
      ["localStorage", "sessionStorage"].forEach((storeName) => {
        try {
          const store = window[storeName];
          if (!store) return;
          const keys = [];
          for (let index = 0; index < store.length; index += 1) keys.push(store.key(index));
          keys.forEach((key) => {
            if (key && /sheet|csv|kpi|brutto|ecom-data/i.test(key)) store.removeItem(key);
          });
        } catch (error) {
          /* storage tidak tersedia */
        }
      });
      const url = SHEET_CSV_URL + "&_cb=" + Date.now() + "_" + Math.random().toString(36).substring(2);
      sheetCsvPromise = fetch(url, { cache: "reload" }).then((response) => {
        if (!response.ok) throw new Error("sheet");
        return response.text();
      });
      return sheetCsvPromise;
    }

    function sheetMonthLabel(year, monthText) {
      const token = String(monthText || "").trim().replace(/\./g, "-").split(/[-\s]/)[0].toUpperCase().slice(0, 3);
      const month = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MEI: 5, MAY: 5, JUN: 6, JUL: 7, AGU: 8, AGS: 8, AUG: 8, SEP: 9, OKT: 10, OCT: 10, NOV: 11, DES: 12, DEC: 12 }[token];
      const names = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      if (!month || !year) return "";
      return names[month] + " " + String(year).slice(2);
    }

    function labelOrder(label) {
      const parts = String(label || "").split(" ");
      const month = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, Mei: 5, Jun: 6, Jul: 7, Ags: 8, Sep: 9, Okt: 10, Nov: 11, Des: 12 }[parts[0]];
      return Number("20" + parts[1]) * 12 + (month || 0);
    }

    function miliarLabel(value) {
      return "Rp " + (value / 1e9).toFixed(2).replace(".", ",") + " Miliar";
    }

    function applyLiveSheet(csv) {
      const table = parseSheetCsv(csv);
      if (table.length < 2) return;
      const header = table[0].map((name) => String(name).trim().toUpperCase());
      const yearIndex = header.indexOf("TAHUN");
      const monthIndex = header.indexOf("BULAN");
      const platformIndex = header.indexOf("NM_PLG");
      const brandIndex = header.indexOf("MERK");
      const statusIndex = header.indexOf("STAT_PO");
      const revenueIndex = header.findIndex((name) => name.includes("BRUTTO"));
      if ([yearIndex, monthIndex, platformIndex, statusIndex, revenueIndex].some((index) => index < 0)) return;

      const openLabels = new Set(labels.filter((_, index) => actual[index] == null));
      const horizon = labelOrder(labels[labels.length - 1] || "");
      const monthSums = new Map();
      const rows = [];
      const brandAdd = new Map();
      const platformAdd = new Map();
      table.slice(1).forEach((line) => {
        const year = Number(line[yearIndex]);
        const month = String(line[monthIndex] || "").trim();
        const status = String(line[statusIndex] || "").trim().toUpperCase();
        const platform = String(line[platformIndex] || "").trim();
        const brand = brandIndex < 0 ? "" : String(line[brandIndex] || "").trim();
        const amount = sheetAmount(line[revenueIndex]);
        rows.push({ year, month, status, platform, brand, amount });
        if (status !== "DIKIRIM" || !year) return;
        const label = sheetMonthLabel(year, month);
        if (!label) return;
        monthSums.set(label, (monthSums.get(label) || 0) + amount);
        if (!openLabels.has(label) && labelOrder(label) <= horizon) return;
        const brandName = brand.toUpperCase();
        const slot = brandName.includes("BANANA") ? 0 : brandName.includes("INTUITION") ? 1 : brandName.includes("SCHICK") ? 2 : brandName.includes("FREEMAN") ? 3 : -1;
        if (slot >= 0) {
          if (!brandAdd.has(year)) brandAdd.set(year, [0, 0, 0, 0]);
          brandAdd.get(year)[slot] += amount;
        }
        const shortPlatform = platformShortName(platform);
        platformAdd.set(shortPlatform, (platformAdd.get(shortPlatform) || 0) + amount);
      });
      window.SHEET_ROWS = rows;

      labels.forEach((label, index) => {
        if (monthSums.has(label)) actual[index] = monthSums.get(label);
      });
      [...monthSums.keys()]
        .filter((label) => !labels.includes(label) && labelOrder(label) > horizon)
        .sort((a, b) => labelOrder(a) - labelOrder(b))
        .forEach((label) => {
          labels.push(label);
          actual.push(monthSums.get(label));
          forecast.push(null);
        });
      lastActualIdx = actual.reduce((acc, value, index) => (value != null ? index : acc), -1);
      forecastIdx = forecast.length - 1;
      if (lastActualIdx >= 0) setText("trendCaption", labels[lastActualIdx] + ": " + IDR.format(actual[lastActualIdx]));

      brandAdd.forEach((amounts, year) => {
        const series = brandYearSeries[String(year)];
        if (!series) return;
        amounts.forEach((amount, slot) => {
          if (!amount) return;
          series[slot] = Math.round((series[slot] + amount / 1e9) * 1000) / 1000;
        });
      });
      const brandAdded = brandAdd.get(2026) || [0, 0, 0, 0];
      platformAdd.forEach((amount, name) => {
        const platform = platforms.find((item) => item.name === name);
        if (platform) platform.value += amount;
      });
      const platformTotal = platforms.reduce((sum, item) => sum + item.value, 0);
      platforms.forEach((item) => {
        item.pct = platformTotal ? Math.round((item.value / platformTotal) * 100) : 0;
      });
      const pctGap = 100 - platforms.reduce((sum, item) => sum + item.pct, 0);
      if (pctGap && platforms.length) platforms[0].pct += pctGap;
      brands.forEach((item) => {
        const slot = item.name === "Banana Boat" ? 0 : item.name === "Intuition" ? 1 : item.name === "Schick" ? 2 : -1;
        if (slot < 0 || !brandAdded[slot]) return;
        item.value += brandAdded[slot];
        item.value_miliar = Math.round((item.value / 1e9) * 100) / 100;
        item.label = miliarLabel(item.value);
      });
      if (D.top_platform && /shopee/i.test(D.top_platform.name)) {
        D.top_platform.value += platformAdd.get("Shopee") || 0;
        D.top_platform.label = miliarLabel(D.top_platform.value);
        setText("topPlatformValue", D.top_platform.label);
      }
      if (D.top_brand && /banana/i.test(D.top_brand.name)) {
        D.top_brand.value += brandAdded[0];
        D.top_brand.label = miliarLabel(D.top_brand.value);
        setText("topBrandValue", D.top_brand.label);
      }
      setText("platformCaption", platforms.map((item) => item.name + " " + item.pct + "%").join(" · "));
      setText("brandCaption", brands.map((item) => item.name + " " + String(item.value_miliar).replace(".", ",") + "M").join(" · "));
    }

    function buildPlatformYearChart() {
      const canvas = document.getElementById("platformYearChart");
      return loadSheetCsvText()
        .then((csv) => {
          const table = parseSheetCsv(csv);
          const header = table[0].map((name) => String(name).trim().toUpperCase());
          const yearIndex = header.indexOf("TAHUN");
          const platformIndex = header.indexOf("NM_PLG");
          const statusIndex = header.indexOf("STAT_PO");
          const revenueIndex = header.findIndex((name) => name.includes("BRUTTO"));
          if ([yearIndex, platformIndex, statusIndex, revenueIndex].some((index) => index < 0)) return;
          const totals = new Map();
          table.slice(1).forEach((line) => {
            if (String(line[statusIndex] || "").trim().toUpperCase() !== "DIKIRIM") return;
            const year = Number(line[yearIndex]);
            const platform = String(line[platformIndex] || "").trim();
            if (!year || !platform) return;
            if (!totals.has(platform)) totals.set(platform, new Map());
            const years = totals.get(platform);
            years.set(year, (years.get(year) || 0) + sheetAmount(line[revenueIndex]));
          });
          const yearList = [...new Set([...totals.values()].flatMap((years) => [...years.keys()]))].sort((a, b) => a - b).slice(-3);
          const platforms = [...totals.entries()]
            .map(([name, years]) => ({
              name: platformShortName(name),
              total: yearList.reduce((sum, year) => sum + (years.get(year) || 0), 0),
              values: yearList.map((year) => Math.round(((years.get(year) || 0) / 1e9) * 1000) / 1000),
            }))
            .filter((item) => item.total > 0)
            .sort((a, b) => b.total - a.total);
          if (!platforms.length || !yearList.length) return;
          const palette = ["#0F766E", "#D4AF37", "#334155"];
          const platformYearGrowthPlugin = {
            id: "platformYearGrowth",
            afterDatasetsDraw(chart) {
              const { ctx } = chart;
              const narrow = chart.width < 800;
              const fontSize = narrow ? 9 : 11;
              ctx.save();
              ctx.font = "600 " + fontSize + "px Outfit, sans-serif";
              chart.data.datasets.forEach((dataset, datasetIndex) => {
                if (datasetIndex === 0) return;
                const meta = chart.getDatasetMeta(datasetIndex);
                if (meta.hidden) return;
                meta.data.forEach((bar, index) => {
                  const current = platforms[index].values[datasetIndex];
                  const prior = platforms[index].values[datasetIndex - 1];
                  const label = formatBrandGrowth(current, prior);
                  if (!label) return;
                  ctx.fillStyle = label.charAt(0) === "−" ? "#991B1B" : "#0F766E";
                  ctx.save();
                  if (narrow) {
                    ctx.translate(bar.x, bar.y - 3);
                    ctx.rotate(-Math.PI / 2);
                    ctx.textAlign = "left";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, 0, 0);
                  } else {
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";
                    ctx.fillText(label, bar.x, bar.y - 4);
                  }
                  ctx.restore();
                });
              });
              ctx.restore();
            },
          };
          return new Chart(canvas, {
            type: "bar",
            plugins: [platformYearGrowthPlugin],
            data: {
              labels: platforms.map((item) => item.name),
              datasets: yearList.map((year, index) => ({
                label: String(year),
                data: platforms.map((item) => item.values[index]),
                backgroundColor: palette[index % palette.length],
                borderRadius: 8,
                maxBarThickness: 28,
              })),
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { top: 22 } },
              animation: { duration: 1500, easing: "easeOutQuart" },
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { color: "#334155", padding: 16, usePointStyle: true, pointStyle: "circle" },
                },
                tooltip: {
                  ...tooltipTheme,
                  callbacks: {
                    label(ctx) {
                      return " " + ctx.dataset.label + ": Rp " + String(ctx.raw).replace(".", ",") + " Miliar";
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "#1E293B", maxRotation: 40, minRotation: 0, autoSkip: false },
                },
                y: {
                  beginAtZero: true,
                  grace: "24%",
                  grid: { color: "rgba(148,163,184,0.2)" },
                  ticks: {
                    color: "#475569",
                    callback(value) { return value + " M"; },
                  },
                },
              },
            },
          });
        })
        .catch(() => {});
    }

    function buildSlaChart() {
      const yearCanvas = document.getElementById("slaYearChart");
      const detailCanvas = document.getElementById("slaDetailChart");
      const kpiHost = document.getElementById("slaKpis");
      return loadSheetCsvText()
        .then((csv) => {
          const table = parseSheetCsv(csv);
          const header = table[0].map((name) => String(name).trim().toUpperCase());
          const yearIndex = header.indexOf("TAHUN");
          const platformIndex = header.indexOf("NM_PLG");
          const statusIndex = header.indexOf("STAT_PO");
          const revenueIndex = header.findIndex((name) => name.includes("BRUTTO"));
          if ([yearIndex, platformIndex, statusIndex, revenueIndex].some((index) => index < 0)) return;
          const presentYears = [...new Set(table.slice(1).map((line) => Number(line[yearIndex])).filter((year) => year >= 2024))].sort((a, b) => a - b);
          const years = (presentYears.length ? presentYears : [2024, 2025, 2026]).slice(-3);
          const totals = new Map();
          table.slice(1).forEach((line) => {
            const year = Number(line[yearIndex]);
            if (!years.includes(year)) return;
            const platform = platformShortName(String(line[platformIndex] || "").trim());
            if (!platform) return;
            if (!totals.has(platform)) totals.set(platform, new Map());
            const byYear = totals.get(platform);
            const current = byYear.get(year) || { sent: 0, all: 0 };
            const amount = sheetAmount(line[revenueIndex]);
            current.all += amount;
            if (String(line[statusIndex] || "").trim().toUpperCase() === "DIKIRIM") current.sent += amount;
            byYear.set(year, current);
          });
          const palette = {
            Shopee: "#0F766E",
            Tokopedia: "#0369A1",
            "Mitra Semeru": "#B8860B",
            "Alfa Gift": "#C2410C",
            "Berhasil Tumbuh": "#7C3AED",
            Lazada: "#0E7490",
            Blibli: "#334155",
          };
          const fallback = ["#0F766E", "#0369A1", "#B8860B", "#C2410C", "#7C3AED", "#0E7490"];
          const platforms = [...totals.entries()]
            .map(([name, byYear]) => ({
              name,
              total: years.reduce((sum, year) => sum + ((byYear.get(year) || { all: 0 }).all), 0),
              sla: years.map((year) => {
                const row = byYear.get(year);
                if (!row || !row.all) return null;
                return Math.round((row.sent / row.all) * 1000) / 10;
              }),
            }))
            .filter((item) => item.total > 0)
            .sort((a, b) => b.total - a.total)
            .map((item, index) => ({ ...item, color: palette[item.name] || fallback[index % fallback.length] }));
          const slaTitle = document.getElementById("slaTitle");
          if (slaTitle) slaTitle.textContent = "SERVICE LEVEL INDICATOR (" + years[0] + "-" + years[years.length - 1] + ")";
          if (!platforms.length || !yearCanvas || !detailCanvas || !kpiHost) return;
          const pctText = (value) => (value == null ? "—" : String(value).replace(".", ",") + "%");
          const present = platforms.flatMap((item) => item.sla.filter((value) => value != null));
          const axisMin = present.length ? Math.max(0, Math.floor((Math.min(...present) - 4) / 5) * 5) : 0;
          const legend = {
            position: "bottom",
            labels: { color: "#334155", padding: 12, usePointStyle: true, pointStyle: "circle", boxWidth: 8 },
          };
          const pctTooltip = {
            ...tooltipTheme,
            callbacks: {
              label(ctx) {
                if (ctx.raw == null) return "";
                return " " + ctx.dataset.label + ": " + pctText(ctx.raw);
              },
            },
          };
          const yScale = {
            min: axisMin,
            max: 100,
            grid: { color: "rgba(148,163,184,0.2)" },
            ticks: {
              color: "#475569",
              callback(value) { return value + "%"; },
            },
          };
          const slaBarValuePlugin = {
            id: "slaBarValues",
            afterDraw(chart) {
              const { ctx } = chart;
              ctx.save();
              ctx.font = "600 9px Outfit, sans-serif";
              ctx.fillStyle = "#1E293B";
              ctx.textAlign = "center";
              ctx.textBaseline = "bottom";
              chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (meta.hidden) return;
                meta.data.forEach((bar, index) => {
                  const value = dataset.data[index];
                  if (value == null || !bar || Number.isNaN(bar.x)) return;
                  ctx.fillText(pctText(value), bar.x, bar.y - 3);
                });
              });
              ctx.restore();
            },
          };
          const slaDividerPlugin = {
            id: "slaCategoryDividers",
            afterDraw(chart) {
              const xScale = chart.scales.x;
              const area = chart.chartArea;
              const count = chart.data.labels.length;
              if (!xScale || !area || count < 2) return;
              const { ctx } = chart;
              ctx.save();
              ctx.strokeStyle = "rgba(15, 39, 68, 0.28)";
              ctx.lineWidth = 1;
              for (let index = 0; index < count - 1; index += 1) {
                const mid = (xScale.getPixelForTick(index) + xScale.getPixelForTick(index + 1)) / 2;
                ctx.beginPath();
                ctx.moveTo(mid, area.top);
                ctx.lineTo(mid, area.bottom);
                ctx.stroke();
              }
              ctx.restore();
            },
          };
          const barPlugins = [slaBarValuePlugin, slaDividerPlugin];
          const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 18, bottom: 8 } },
            animation: { duration: 1500, easing: "easeOutQuart" },
            plugins: { legend, tooltip: pctTooltip },
          };
          kpiHost.replaceChildren();
          const latestYear = years[years.length - 1];
          const appendSlaCard = (name, value, color) => {
            const card = document.createElement("article");
            card.className = "sla-card";
            const status = value >= 90 ? "Excellent" : value >= 80 ? "Good" : value >= 70 ? "Acceptable" : "Poor";
            const safeName = name.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
            card.innerHTML = [
              "<header><span><i class=\"sla-dot\" style=\"background:" + color + "\"></i><strong>" + safeName.toUpperCase() + " SLA</strong></span><em>" + latestYear + "</em></header>",
              "<b>" + pctText(value) + "</b>",
              "<span class=\"sla-status " + status.toLowerCase() + "\">" + status + "</span>",
            ].join("");
            kpiHost.appendChild(card);
          };
          platforms.forEach((item) => {
            const latest = item.sla[years.length - 1];
            if (latest == null || latest === 0) return;
            appendSlaCard(item.name, latest, item.color);
          });
          let sentAll = 0;
          let grossAll = 0;
          totals.forEach((byYear) => {
            const row = byYear.get(latestYear);
            if (!row) return;
            sentAll += row.sent;
            grossAll += row.all;
          });
          if (grossAll > 0) appendSlaCard("All Platform", Math.round((sentAll / grossAll) * 1000) / 10, "#0F2744");
          const yearChart = new Chart(yearCanvas, {
            type: "bar",
            plugins: barPlugins,
            data: {
              labels: years.map(String),
              datasets: platforms.map((item) => ({
                label: item.name,
                data: item.sla,
                backgroundColor: item.color,
                borderRadius: 6,
                maxBarThickness: 18,
              })),
            },
            options: {
              ...barOptions,
              scales: {
                x: { grid: { display: false }, ticks: { color: "#1E293B", padding: 8 } },
                y: yScale,
              },
            },
          });
          new Chart(detailCanvas, {
            type: "bar",
            plugins: barPlugins,
            data: {
              labels: platforms.map((item) => item.name),
              datasets: years.map((year, index) => ({
                label: String(year),
                data: platforms.map((item) => item.sla[index]),
                backgroundColor: ["#0F766E", "#D4AF37", "#334155"][index],
                borderRadius: 6,
                maxBarThickness: 16,
              })),
            },
            options: {
              ...barOptions,
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "#1E293B", padding: 8, maxRotation: 0, minRotation: 0, autoSkip: false },
                },
                y: yScale,
              },
            },
          });
          return yearChart;
        })
        .catch(() => {});
    }

    const builders = {
      trendChart: buildTrendChart,
      platformChart: buildPlatformChart,
      brandChart: buildBrandChart,
      brandYearChart: buildBrandYearChart,
      platformYearChart: buildPlatformYearChart,
      slaYearChart: buildSlaChart,
    };

    const sheetReady = loadSheetCsvText().then((csv) => applyLiveSheet(csv)).catch(() => {});

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && !initialized[id] && builders[id]) {
          initialized[id] = true;
          sheetReady.then(() => { builders[id](); });
        }
      });
    }, { threshold: 0.35 });

    Object.keys(builders).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
      offset: 40,
      startEvent: "DOMContentLoaded",
    });
    window.addEventListener("load", () => AOS.refresh());

    document.querySelectorAll(".accordion-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const willOpen = !item.classList.contains("open");
        document.querySelectorAll(".accordion-item").forEach((el) => {
          el.classList.remove("open");
          el.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
        });
        if (willOpen) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    const sections = ["hero", "snapshot", "tren", "kinerja", "sla", "merek", "promo", "saran", "ai"];
    const navLinks = document.querySelectorAll(".nav-link");
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const backBtn = document.getElementById("backDashboard");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        try {
          const url = new URL(window.parent.location.href);
          url.searchParams.delete("view");
          window.parent.location.href = url.toString();
        } catch (err) {
          window.location.href = "/";
        }
      });
    }
