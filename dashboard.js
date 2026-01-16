const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw2xzr4eZg_JZdU3d7DuxDcAr-qaCqCH5bpoXNRRhnZyATKVeWFkuQt92CT_iXYQC7N/exec";

const meta = document.getElementById("meta");
const labels = ["1", "2", "3", "4", "5"];

async function loadCounts() {
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
      options: { responsive: true }
    });

    const donutCtx = document.getElementById("donutChart");
    new Chart(donutCtx, {
      type: "doughnut",
      data: { labels, datasets: [{ label: "Responses", data: counts }] },
      options: { responsive: true }
    });
  } catch (e) {
    meta.textContent = "Could not load dashboard data.";
  }
})();
