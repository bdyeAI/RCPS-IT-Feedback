// Paste the same Google Apps Script Web App URL used in app.js
const SCRIPT_URL = "YOUR_SCRIPT_URL";

const meta = document.getElementById("meta");
const labels = ["1","2","3","4","5"];

async function loadCounts(){
  const res = await fetch(`${SCRIPT_URL}?mode=counts`, { mode: "cors" });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Failed to load counts");
  return data;
}

(async () => {
  try {
    const data = await loadCounts();
    const counts = labels.map(k => data.counts[k] || 0);

    meta.textContent = `Total responses: ${data.total} • Last updated: ${new Date().toLocaleString()}`;

    const barCtx = document.getElementById("barChart");
    new Chart(barCtx, {
      type: "bar",
      data: { labels, datasets: [{ label: "Responses", data: counts }] },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });

    const donutCtx = document.getElementById("donutChart");
    new Chart(donutCtx, {
      type: "doughnut",
      data: { labels, datasets: [{ label: "Responses", data: counts }] },
      options: { responsive: true }
    });
  } catch (e) {
    meta.textContent = "Could not load dashboard data. Check SCRIPT_URL and Apps Script deployment.";
  }
})();
