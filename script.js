window.PRESENTATION_DATA = {"source_file": "DATA E-COM.xlsx", "top_platform": {"name": "PT. Shopee International", "value": 1820979900.0, "label": "Rp 1,82 Miliar"}, "top_brand": {"name": "BANANA BOAT", "value": 1710855000.0, "label": "Rp 1,71 Miliar"}, "top_item": {"name": "Sport SPF 50 90ML", "value": 430768000.0, "label": "Rp 0,43 Miliar"}, "trend": {"labels": ["Jan 24", "Feb 24", "Mar 24", "Apr 24", "Mei 24", "Jun 24", "Jul 24", "Ags 24", "Sep 24", "Okt 24", "Nov 24", "Des 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "Mei 25", "Jun 25", "Jul 25", "Ags 25", "Sep 25", "Okt 25", "Nov 25", "Des 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "Mei 26", "Jun 26", "Jul 26", "Ags 26", "Sep 26"], "actual": [35245800.0, 105575200.0, 175568100.0, 141435900.0, 226346400.0, 334026100.0, 267281400.0, 380722400.0, 529964600.0, 221942300.0, 182773000.0, 273895600.0, 86368200.0, 214634700.0, 404713600.0, 367952600.0, 505570200.0, 281467600.0, 239891400.0, 190911600.0, 366950500.0, 306052400.0, 201038700.0, 155586400.0, 441309400.0, 167267300.0, 97305700.0, 469761000.0, 258296500.0, 326637200.0, 404638400.0, 370634700.0, null], "forecast": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 370634700.0, 437966053.0], "last_actual_label": "Ags 26", "last_actual_value": 370634700.0, "last_actual_text": "Rp 370.634.700", "forecast_label": "Sep 26", "forecast_value": 437966053.0, "forecast_text": "Rp 437.966.053", "growth_pct": 18}, "platforms": [{"name": "Shopee", "full_name": "PT. Shopee International", "value": 7604759700.0, "pct": 80}, {"name": "Tokopedia", "full_name": "PT. Tokopedia", "value": 1061881900.0, "pct": 11}, {"name": "Mitra Semeru", "full_name": "PT. Mitra Semeru", "value": 846417800.0, "pct": 9}], "brands": [{"name": "Banana Boat", "value": 6810241600.0, "value_miliar": 6.81, "label": "Rp 6,81 Miliar"}, {"name": "Intuition", "value": 2328481500.0, "value_miliar": 2.33, "label": "Rp 2,33 Miliar"}, {"name": "Schick", "value": 592677100.0, "value_miliar": 0.59, "label": "Rp 0,59 Miliar"}], "insights": [{"title": "Alokasi Budget Marketing", "body": "Alokasi Budget Marketing: Mengingat prediksi lonjakan omset ke Rp 437 Juta di bulan September, tingkatkan budget ads di Shopee khusus untuk produk Sport SPF 50."}, {"title": "Fokus Promosi Item Menurun", "body": "Fokus Promosi Item Menurun: Arahkan program promosi ke item dengan tren penurunan penjualan. Utamakan item yang ditandai latar merah, karena item tersebut juga masuk daftar Top 10."}, {"title": "Optimasi Mitra Semeru", "body": "Optimasi Mitra Semeru: Lakukan kampanye co-branding atau diskon khusus untuk menaikkan penetrasi pasar di Mitra Semeru, kanal aktif berikutnya dengan kinerja terendah setelah Tokopedia ditutup."}, {"title": "Manajemen Inventaris", "body": "Manajemen Inventaris: Amankan stok produk 'Simply Protect Kids' dan 'Sport SPF 50' menjelang peak season akhir tahun. Selalu jaga dan amankan buffer stok, terutama untuk item Top 10, agar tidak terjadi kekosongan stok."}]};
    const D = window.PRESENTATION_DATA;
    const IDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    const IDR_SHORT = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

    function setText(id, value) {
      const el = document.getElementById(id);
      if (el && value != null) el.textContent = value;
    }

    const trend = D.trend || {};
    const labels = trend.labels || [];
    const actual = (trend.actual || []).map((v) => (v == null ? null : Number(v)));
    const forecast = (trend.forecast || []).map((v) => (v == null ? null : Number(v)));
    const lastActualIdx = actual.reduce((acc, v, i) => (v != null ? i : acc), -1);
    const forecastIdx = forecast.length - 1;
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

    function buildPlatformYearChart() {
      const canvas = document.getElementById("platformYearChart");
      return fetch(SHEET_CSV_URL)
        .then((response) => {
          if (!response.ok) throw new Error("sheet");
          return response.text();
        })
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
            if (String(line[statusIndex] || "").trim() !== "DIKIRIM") return;
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
      const canvas = document.getElementById("slaChart");
      return fetch(SHEET_CSV_URL)
        .then((response) => {
          if (!response.ok) throw new Error("sheet");
          return response.text();
        })
        .then((csv) => {
          const table = parseSheetCsv(csv);
          const header = table[0].map((name) => String(name).trim().toUpperCase());
          const yearIndex = header.indexOf("TAHUN");
          const platformIndex = header.indexOf("NM_PLG");
          const statusIndex = header.indexOf("STAT_PO");
          const revenueIndex = header.findIndex((name) => name.includes("BRUTTO"));
          if ([yearIndex, platformIndex, statusIndex, revenueIndex].some((index) => index < 0)) return;
          const years = [2024, 2025, 2026];
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
            if (String(line[statusIndex] || "").trim() === "DIKIRIM") current.sent += amount;
            byYear.set(year, current);
          });
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
            .sort((a, b) => b.total - a.total);
          if (!platforms.length) return;
          const sentColors = ["#0F766E", "#D4AF37", "#334155"];
          const openColors = ["rgba(15,118,110,0.28)", "rgba(212,175,55,0.45)", "rgba(51,65,85,0.28)"];
          const slaLabelPlugin = {
            id: "slaPercentLabels",
            afterDatasetsDraw(chart) {
              const { ctx } = chart;
              ctx.save();
              ctx.font = "600 10px Outfit, sans-serif";
              ctx.fillStyle = "#1E293B";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              years.forEach((year, yearIndex) => {
                const meta = chart.getDatasetMeta(yearIndex * 2);
                if (!meta || meta.hidden) return;
                meta.data.forEach((bar, index) => {
                  const value = platforms[index].sla[yearIndex];
                  if (value == null || !bar || Number.isNaN(bar.y)) return;
                  const label = String(value).replace(".", ",") + "%";
                  const height = Math.abs(bar.base - bar.y);
                  if (height >= 16) ctx.fillText(label, bar.x, (bar.y + bar.base) / 2);
                  else ctx.fillText(label, bar.x, Math.min(bar.y, bar.base) - 8);
                });
              });
              ctx.restore();
            },
          };
          const datasets = [];
          years.forEach((year, index) => {
            datasets.push({
              label: year + " DIKIRIM",
              stack: String(year),
              data: platforms.map((item) => item.sla[index]),
              backgroundColor: sentColors[index],
              borderRadius: 6,
              maxBarThickness: 22,
            });
            datasets.push({
              label: year + " TIDAK DIKIRIM",
              stack: String(year),
              data: platforms.map((item) => (item.sla[index] == null ? null : Math.round((100 - item.sla[index]) * 10) / 10)),
              backgroundColor: openColors[index],
              borderRadius: 6,
              maxBarThickness: 22,
            });
          });
          return new Chart(canvas, {
            type: "bar",
            plugins: [slaLabelPlugin],
            data: {
              labels: platforms.map((item) => item.name),
              datasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              layout: { padding: { top: 16 } },
              animation: { duration: 1500, easing: "easeOutQuart" },
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { color: "#334155", padding: 14, usePointStyle: true, pointStyle: "circle", boxWidth: 8 },
                },
                tooltip: {
                  ...tooltipTheme,
                  callbacks: {
                    label(ctx) {
                      if (ctx.raw == null) return "";
                      return " " + ctx.dataset.label + ": " + String(ctx.raw).replace(".", ",") + "%";
                    },
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                  grid: { display: false },
                  ticks: { color: "#1E293B", maxRotation: 40, minRotation: 0, autoSkip: false },
                },
                y: {
                  stacked: true,
                  min: 0,
                  max: 100,
                  grid: { color: "rgba(148,163,184,0.2)" },
                  ticks: {
                    color: "#475569",
                    callback(value) { return value + "%"; },
                  },
                },
              },
            },
          });
        })
        .catch(() => {});
    }

    const builders = {
      trendChart: buildTrendChart,
      platformChart: buildPlatformChart,
      brandChart: buildBrandChart,
      brandYearChart: buildBrandYearChart,
      platformYearChart: buildPlatformYearChart,
      slaChart: buildSlaChart,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting && !initialized[id] && builders[id]) {
          initialized[id] = builders[id]();
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
