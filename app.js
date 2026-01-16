const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2xzr4eZg_JZdU3d7DuxDcAr-qaCqCH5bpoXNRRhnZyATKVeWFkuQt92CT_iXYQC7N/exec";

let selectedScore = null;

const faces = Array.from(document.querySelectorAll(".face"));
const hint = document.getElementById("selectedHint");
const submitBtn = document.getElementById("submitBtn");
const commentsEl = document.getElementById("comments");
const ariaStatus = document.getElementById("ariaStatus");

// Optional context captured from URL: ?customer=...&ticket=...
const params = new URLSearchParams(location.search);
const customer = params.get("customer") || "";
const ticket = params.get("ticket") || "";

function setSelected(btn) {
  faces.forEach(b => {
    b.classList.remove("selected");
    b.setAttribute("aria-checked", "false");
  });

  btn.classList.add("selected");
  btn.setAttribute("aria-checked", "true");

  selectedScore = Number(btn.dataset.score);
  submitBtn.disabled = false;

  const label = btn.getAttribute("aria-label") || `Score ${selectedScore}`;
  hint.textContent = `Selected: ${label}`;
  ariaStatus.textContent = `Selected ${label}.`;
}

faces.forEach((btn, idx) => {
  btn.addEventListener("click", () => setSelected(btn));

  btn.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown") {
      e.preventDefault();
      faces[(idx + 1) % faces.length].focus();
      return;
    }
    if (k === "ArrowLeft" || k === "ArrowUp") {
      e.preventDefault();
      faces[(idx - 1 + faces.length) % faces.length].focus();
      return;
    }
    if (k === "Enter" || k === " ") {
      e.preventDefault();
      setSelected(btn);
    }
  });
});

submitBtn.addEventListener("click", async () => {
  if (!selectedScore) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const payload = {
    score: selectedScore,
    comments: commentsEl.value || "",
    customer,
    ticket,
    userAgent: navigator.userAgent
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok !== true) throw new Error(data.error || "Submit failed");

    location.href = "thanks.html";
  } catch (e) {
    alert("Sorry — we couldn’t submit your response. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
