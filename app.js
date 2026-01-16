// 1) Deploy the Google Apps Script as a Web App.
// 2) Paste its URL below.
const SCRIPT_URL = "YOUR_SCRIPT_URL"; // e.g. https://script.google.com/macros/s/XXXX/exec

let selectedScore = null;

const faces = document.querySelectorAll(".face-img");
const hint = document.getElementById("selectedHint");
const ariaStatus = document.getElementById("ariaStatus");
const submitBtn = document.getElementById("submitBtn");
const commentsEl = document.getElementById("comments");

// Optional: capture who the customer is, via querystring like ?customer=Acme&ticket=123
const params = new URLSearchParams(location.search);
const customer = params.get("customer") || "";
const ticket = params.get("ticket") || "";

function labelForScore(score){
  switch (score) {
    case 1: return "Extremely Unsatisfied";
    case 2: return "Unsatisfied";
    case 3: return "Neutral";
    case 4: return "Satisfied";
    case 5: return "Extremely Satisfied";
    default: return "";
  }
}

function selectScore(score, btn){
  selectedScore = score;

  faces.forEach(b => {
    b.classList.remove("selected");
    b.setAttribute("aria-checked", "false");
  });

  btn.classList.add("selected");
  btn.setAttribute("aria-checked", "true");

  const label = labelForScore(score);
  hint.textContent = `Selected: ${label} (${score}/5)`;
  ariaStatus.textContent = `Selected ${label}.`;
  submitBtn.disabled = false;
}

faces.forEach((btn) => {
  btn.addEventListener("click", () => {
    const score = Number(btn.dataset.score);
    selectScore(score, btn);
  });

  // Keyboard support: Arrow keys to move within the radiogroup
  btn.addEventListener("keydown", (e) => {
    const idx = Array.from(faces).indexOf(btn);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = faces[Math.min(idx + 1, faces.length - 1)];
      next.focus();
      selectScore(Number(next.dataset.score), next);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = faces[Math.max(idx - 1, 0)];
      prev.focus();
      selectScore(Number(prev.dataset.score), prev);
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
