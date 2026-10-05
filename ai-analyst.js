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

  function fillList(node, items) {
    node.replaceChildren();
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
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
    answer.textContent = text;
    answerCard.hidden = false;
    report.hidden = true;
    result.hidden = false;
  }

  function render(data) {
    fields.summary.textContent = data.summary || "";
    fields.trend_analysis.textContent = data.trend_analysis || "";
    fields.platform_analysis.textContent = data.platform_analysis || "";
    fields.brand_analysis.textContent = data.brand_analysis || "";
    fields.product_analysis.textContent = data.product_analysis || "";
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
