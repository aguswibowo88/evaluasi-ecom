(function () {
  const status = document.getElementById("aiStatus");
  const result = document.getElementById("aiResult");
  const analyze = document.getElementById("aiAnalyze");
  const form = document.getElementById("aiAskForm");
  const question = document.getElementById("aiQuestion");
  const ask = document.getElementById("aiAsk");
  const answerCard = document.getElementById("aiAnswerCard");
  const answer = document.getElementById("aiAnswer");
  const report = document.getElementById("aiReport");
  if (!status || !result || !analyze || !form || !question || !ask || !answerCard || !answer || !report) return;

  const fields = {
    summary: document.getElementById("aiSummary"),
    trend_analysis: document.getElementById("aiTrend"),
    platform_analysis: document.getElementById("aiPlatform"),
    brand_analysis: document.getElementById("aiBrand"),
    product_analysis: document.getElementById("aiProduct"),
  };
  const lists = {
    key_findings: document.getElementById("aiFindings"),
    anomalies: document.getElementById("aiAnomalies"),
    possible_explanations: document.getElementById("aiHypotheses"),
    recommendations: document.getElementById("aiRecommendations"),
  };

  function setBusy(busy) {
    analyze.disabled = busy;
    ask.disabled = busy;
    question.disabled = busy;
    status.textContent = busy ? "AI sedang menganalisis data..." : "";
  }

  function inlineNodes(text) {
    const frag = document.createDocumentFragment();
    const source = String(text || "");
    const pattern = /\*\*(.+?)\*\*/g;
    let last = 0;
    let match = pattern.exec(source);
    while (match) {
      if (match.index > last) frag.append(document.createTextNode(source.slice(last, match.index)));
      const strong = document.createElement("strong");
      strong.textContent = match[1];
      frag.append(strong);
      last = match.index + match[0].length;
      match = pattern.exec(source);
    }
    if (last < source.length) frag.append(document.createTextNode(source.slice(last)));
    return frag;
  }

  function isTableLine(line) {
    return /^\s*\|.+\|\s*$/.test(line);
  }

  function isBulletLine(line) {
    return /^\s*(?:[-*•]|\d+[.)])\s+\S/.test(line);
  }

  function isHeadingLine(line) {
    return /^\s*#{1,3}\s+\S/.test(line);
  }

  function buildTable(rows) {
    const wrap = document.createElement("div");
    wrap.className = "ai-table-wrap";
    const table = document.createElement("table");
    table.className = "ai-table";
    const head = document.createElement("thead");
    const body = document.createElement("tbody");
    rows.forEach((cells, index) => {
      const tr = document.createElement("tr");
      cells.forEach((cell) => {
        const td = document.createElement(index === 0 ? "th" : "td");
        td.append(inlineNodes(cell));
        tr.append(td);
      });
      (index === 0 ? head : body).append(tr);
    });
    table.append(head, body);
    wrap.append(table);
    return wrap;
  }

  function renderPresentation(root, source) {
    root.replaceChildren();
    const lines = String(source || "").replace(/\r\n/g, "\n").split("\n");
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i += 1;
        continue;
      }
      if (isHeadingLine(line)) {
        const heading = document.createElement("h3");
        heading.append(inlineNodes(line.replace(/^\s*#{1,3}\s+/, "")));
        root.append(heading);
        i += 1;
        continue;
      }
      if (isTableLine(line)) {
        const rows = [];
        while (i < lines.length && isTableLine(lines[i])) {
          const cells = lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
          if (!cells.every((cell) => /^:?-+:?$/.test(cell))) rows.push(cells);
          i += 1;
        }
        if (rows.length) root.append(buildTable(rows));
        continue;
      }
      if (isBulletLine(line)) {
        const list = document.createElement("ul");
        while (i < lines.length && isBulletLine(lines[i])) {
          const item = document.createElement("li");
          item.append(inlineNodes(lines[i].replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")));
          list.append(item);
          i += 1;
        }
        root.append(list);
        continue;
      }
      const paragraph = document.createElement("p");
      const buffer = [line.trim()];
      i += 1;
      while (i < lines.length && lines[i].trim() && !isHeadingLine(lines[i]) && !isTableLine(lines[i]) && !isBulletLine(lines[i])) {
        buffer.push(lines[i].trim());
        i += 1;
      }
      paragraph.append(inlineNodes(buffer.join(" ")));
      root.append(paragraph);
    }
  }

  function fillList(node, items) {
    node.replaceChildren();
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.append(inlineNodes(item));
      node.appendChild(li);
    });
  }

  const AUTHOR_ANSWER = "Inisiatif pengembangan program ini diprakarsai dan dieksekusi langsung oleh Agus Wibowo. Latar belakang pengembangannya didasari oleh kebutuhan riil di lapangan akan sebuah sistem yang presisi dan adaptif. Dengan menggabungkan pemahaman mendalam tentang tata kelola operasional bisnis dan arsitektur data, program ini hadir sebagai solusi mandiri yang efisien, fleksibel, serta siap mendukung pertumbuhan bisnis secara berkelanjutan.";
  const TECH_ANSWER = "Program ini dibuat dengan menggunakan HTML, JS, CSS, Back End dan Front End, disimpan ke Github dan menghubungkan AI dengan kode API dari Google Studio AI.";

  function exclusiveAnswer(text) {
    const value = String(text || "").toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
    const aboutProgram = /(program|aplikasi|website|web site|sistem|presentasi|\bini\b)/.test(value);
    const creatorPhrase = /(siapa(kah)?(?: yang)? (?:membuat|buat|bikin|pembuat|pencipta|developer|pengembang|creator)\b)|(\bwho (?:created|made|built)\b)|(pembuat (?:program|aplikasi|website|sistem|ini)\b)/.test(value);
    const asksAuthor = /(siapa(kah)?|who)\b/.test(value) && /(pembuat|membuat|buat|bikin|pengembang|developer|creator|author|pencipta|pemilik|created|made)\b/.test(value);
    const asksAuthorAlt = aboutProgram && /(pembuat|pengembang|developer|creator|pencipta)\b/.test(value);
    if (creatorPhrase || (asksAuthor && aboutProgram) || asksAuthorAlt || (aboutProgram && /(dibuat|diciptakan|dirancang|created|made)\b/.test(value) && /(siapa|who)/.test(value))) {
      return AUTHOR_ANSWER;
    }
    const asksTech = aboutProgram && (
      /(teknologi|tech stack|bahasa pemrograman|framework|\btools?\b)/.test(value)
      || /(dibuat|buat|dikembangkan|bikin).{0,40}(menggunakan|memakai|pakai|pake|dengan)/.test(value)
      || /(menggunakan|memakai|pakai|pake) apa/.test(value)
    );
    if (asksTech) return TECH_ANSWER;
    return "";
  }

  function showAnswer(text) {
    renderPresentation(answer, text);
    answerCard.hidden = false;
    report.hidden = true;
    result.hidden = false;
  }

  function render(data) {
    renderPresentation(fields.summary, data.summary || "");
    renderPresentation(fields.trend_analysis, data.trend_analysis || "");
    renderPresentation(fields.platform_analysis, data.platform_analysis || "");
    renderPresentation(fields.brand_analysis, data.brand_analysis || "");
    renderPresentation(fields.product_analysis, data.product_analysis || "");
    fillList(lists.key_findings, data.key_findings);
    fillList(lists.anomalies, data.anomalies);
    fillList(lists.possible_explanations, data.possible_explanations);
    fillList(lists.recommendations, data.recommendations);
    answerCard.hidden = true;
    report.hidden = false;
    result.hidden = false;
  }

  function analystEndpoint() {
    const host = location.hostname;
    if (host === "127.0.0.1" || host === "localhost" || host.endsWith("workers.dev")) {
      return new URL("api/analyst", location.href).href;
    }
    return "https://evaluasi-ecom.8-aguswibowo.workers.dev/api/analyst";
  }

  async function run(text, full) {
    setBusy(true);
    result.hidden = true;
    const preset = full ? "" : exclusiveAnswer(text);
    if (preset) {
      status.textContent = "";
      showAnswer(preset);
      analyze.disabled = false;
      ask.disabled = false;
      question.disabled = false;
      return;
    }
    try {
      const response = await fetch(analystEndpoint(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text, full: Boolean(full) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.error) {
        console.error("AI Analyst gagal", response.status, data && data.error ? data.error : data);
        status.textContent = "AI Analyst sedang tidak dapat digunakan. Silakan coba lagi.";
        return;
      }
      status.textContent = "";
      if (!full && data.answer) showAnswer(data.answer);
      else render(data);
    } catch (error) {
      console.error("AI Analyst gagal", error);
      status.textContent = "AI Analyst sedang tidak dapat digunakan. Silakan coba lagi.";
    } finally {
      analyze.disabled = false;
      ask.disabled = false;
      question.disabled = false;
    }
  }

  analyze.addEventListener("click", () => {
    run("Buat analisis eksekutif penjualan e-commerce dari KPI yang tersedia.", true);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = question.value.trim();
    if (!text) return;
    run(text, false);
  });
})();
