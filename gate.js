(function () {
  const gate = document.getElementById("passwordGate");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");
  if (!gate || !form || !input || !error) return;

  const locked = document.querySelectorAll("body > header, body > main, body > footer");
  locked.forEach((node) => { node.inert = true; });

  let expected = "";

  function readPassword(text) {
    const line = String(text || "").split(/\r?\n/).map((item) => item.trim()).find((item) => item.startsWith("SITE_PASSWORD="));
    if (!line) return "";
    let value = line.slice("SITE_PASSWORD=".length).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    return value;
  }

  fetch(new URL(".env", document.baseURI).href, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("env");
      return response.text();
    })
    .then((text) => {
      expected = readPassword(text);
      if (!expected) throw new Error("env");
    })
    .catch(() => {
      error.hidden = false;
      error.textContent = "File .env tidak dapat dibaca.";
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!expected) {
      error.hidden = false;
      error.textContent = "File .env tidak dapat dibaca.";
      return;
    }
    if (input.value !== expected) {
      error.hidden = false;
      error.textContent = "Password salah.";
      input.select();
      return;
    }
    locked.forEach((node) => { node.inert = false; });
    gate.hidden = true;
  });
})();
