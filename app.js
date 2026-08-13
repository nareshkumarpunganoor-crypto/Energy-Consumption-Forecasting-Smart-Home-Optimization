/* =========================================
   ENERGY DASHBOARD - PURE JAVASCRIPT
   No backend. No server. No API calls.
   All data is generated locally.
   ========================================= */

let charts = {};

// ── Startup ────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  initTabs();
  startClock();
  updateCards();
  renderPatternChart();
  renderApplianceChart();
  renderDevices();
  renderForecast();
  renderHistory();
  renderTips();

  // Update cards every 5 seconds (simulate live data)
  setInterval(updateCards, 5000);
});

// ── Clock ──────────────────────────────────
function startClock() {
  const el = document.getElementById("clock");
  const tick = () => {
    el.textContent = new Date().toLocaleString();
  };
  tick();
  setInterval(tick, 1000);
}

// ── Tab Navigation ─────────────────────────
function initTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    });
  });
}

// ── Data Generation ────────────────────────

// Generate consumption value based on hour
function getBaseConsumption(hour) {
  if      (0  <= hour && hour <  6) return 0.5;
  else if (6  <= hour && hour <  9) return 2.5;
  else if (9  <= hour && hour < 17) return 1.2;
  else if (17 <= hour && hour < 22) return 3.5;
  else                               return 1.0;
}

// Add small random variation
function withNoise(val, noise = 0.3) {
  return Math.max(0.1, val + (Math.random() - 0.5) * noise);
}

// Get electricity rate by hour
function getRate(hour) {
  if      (0  <= hour && hour <  7) return 0.08;
  else if (17 <= hour && hour < 22) return 0.28;
  else                               return 0.15;
}

// Get tier name
function getTier(hour) {
  if      (0  <= hour && hour <  7) return "off";
  else if (17 <= hour && hour < 22) return "peak";
  else                               return "mid";
}

function getTierLabel(hour) {
  if      (0  <= hour && hour <  7) return "Off-Peak";
  else if (17 <= hour && hour < 22) return "Peak";
  else                               return "Mid-Peak";
}

// Get temperature based on hour (simple model)
function getTemperature(hour) {
  const base = 18;
  const variation = 6 * Math.sin(Math.PI * (hour - 6) / 12);
  return Math.round((base + variation + (Math.random() - 0.5) * 2) * 10) / 10;
}

// Get solar generation based on hour
function getSolar(hour) {
  if (hour >= 6 && hour <= 20) {
    return Math.max(0, 3.0 * Math.sin(Math.PI * (hour - 6) / 14)).toFixed(2);
  }
  return 0;
}

// Generate 7 days of hourly history data
function generateHistory() {
  const data = [];
  const now  = new Date();

  for (let i = 168; i >= 0; i--) {
    const d    = new Date(now - i * 3600000);
    const hour = d.getHours();
    const kwh  = withNoise(getBaseConsumption(hour));
    const rate = getRate(hour);

    data.push({
      time       : d.toLocaleString(),
      hour       : hour,
      kwh        : Math.round(kwh * 1000) / 1000,
      temperature: getTemperature(hour),
      rate       : rate,
      cost       : Math.round(kwh * rate * 10000) / 10000,
    });
  }
  return data;
}

// Generate 24h forecast
function generateForecast() {
  const data = [];
  const now  = new Date();

  for (let i = 1; i <= 24; i++) {
    const ft   = new Date(now.getTime() + i * 3600000);
    const hour = ft.getHours();
    const kwh  = withNoise(getBaseConsumption(hour));
    const rate = getRate(hour);

    data.push({
      hour : hour,
      label: String(hour).padStart(2, "0") + ":00",
      kwh  : Math.round(kwh * 1000) / 1000,
      rate : rate,
      tier : getTier(hour),
      label_tier: getTierLabel(hour),
      cost : Math.round(kwh * rate * 10000) / 10000,
    });
  }
  return data;
}

// Average consumption per hour (for pattern chart)
function getHourlyPattern() {
  const pattern = {};
  for (let h = 0; h < 24; h++) {
    let total = 0;
    for (let d = 0; d < 30; d++) {
      total += withNoise(getBaseConsumption(h), 0.2);
    }
    pattern[h] = Math.round((total / 30) * 1000) / 1000;
  }
  return pattern;
}

// ── Update Live Cards ──────────────────────
function updateCards() {
  const hour   = new Date().getHours();
  const power  = withNoise(getBaseConsumption(hour), 0.4).toFixed(2);
  const solar  = getSolar(hour);
  const temp   = getTemperature(hour);
  const usage  = (parseFloat(power) * hour * 0.85).toFixed(1);
  const cost   = (parseFloat(usage) * getRate(hour)).toFixed(2);

  document.getElementById("currentPower").textContent = power;
  document.getElementById("todayUsage").textContent   = usage;
  document.getElementById("todayCost").textContent    = cost;
  document.getElementById("temperature").textContent  = temp;
  document.getElementById("solarPower").textContent   = solar;
}

// ── Pattern Chart ──────────────────────────
function renderPatternChart() {
  const ctx = document.getElementById("patternChart");
  if (!ctx) return;

  if (charts["pattern"]) charts["pattern"].destroy();

  const pattern = getHourlyPattern();
  const labels  = Object.keys(pattern).map(h => h + ":00");
  const values  = Object.values(pattern);

  // Color by tier
  const colors = Object.keys(pattern).map(h => {
    h = parseInt(h);
    if (h >= 17 && h < 22) return "rgba(239,68,68,.8)";
    if (h >= 0  && h <  7) return "rgba(16,185,129,.8)";
    return "rgba(245,158,11,.8)";
  });

  charts["pattern"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: chartOptions("kWh", false),
  });
}

// ── Appliance Doughnut Chart ───────────────
function renderApplianceChart() {
  const ctx = document.getElementById("applianceChart");
  if (!ctx) return;

  if (charts["appliance"]) charts["appliance"].destroy();

  charts["appliance"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["HVAC", "Lighting", "Kitchen", "Entertainment", "Water Heater", "EV Charger", "Standby"],
      datasets: [{
        data: [35, 12, 18, 10, 12, 8, 5],
        backgroundColor: [
          "#3b82f6","#10b981","#f59e0b",
          "#8b5cf6","#ef4444","#06b6d4","#6b7280"
        ],
        borderColor: "#1f2937",
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#9ca3af",
            font: { size: 12 },
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: tooltipStyle(),
      }
    }
  });
}

// ── Device Status List ─────────────────────
function renderDevices() {
  const hour = new Date().getHours();
  const devices = [
    {
      icon: "❄️",
      name: "HVAC",
      power: "1.8 kW",
      status: "on",
      label: "Running"
    },
    {
      icon: "💡",
      name: "Lighting",
      power: "0.3 kW",
      status: hour >= 18 || hour < 7 ? "on" : "off",
      label: hour >= 18 || hour < 7 ? "On" : "Off"
    },
    {
      icon: "🍳",
      name: "Kitchen",
      power: "0.8 kW",
      status: [7,8,12,13,18,19,20].includes(hour) ? "on" : "standby",
      label: [7,8,12,13,18,19,20].includes(hour) ? "Active" : "Standby"
    },
    {
      icon: "📺",
      name: "Entertainment",
      power: "0.3 kW",
      status: hour >= 18 && hour < 23 ? "on" : "standby",
      label: hour >= 18 && hour < 23 ? "On" : "Standby"
    },
    {
      icon: "🚿",
      name: "Water Heater",
      power: "2.0 kW",
      status: [6,7,18,19].includes(hour) ? "on" : "standby",
      label: [6,7,18,19].includes(hour) ? "Heating" : "Standby"
    },
    {
      icon: "🚗",
      name: "EV Charger",
      power: "7.0 kW",
      status: hour >= 22 || hour < 6 ? "on" : "off",
      label: hour >= 22 || hour < 6 ? "Charging" : "Idle"
    },
    {
      icon: "☀️",
      name: "Solar Inverter",
      power: getSolar(hour) + " kW",
      status: getSolar(hour) > 0 ? "on" : "off",
      label: getSolar(hour) > 0 ? "Generating" : "Inactive"
    },
    {
      icon: "🔋",
      name: "Battery",
      power: "2.5 kWh",
      status: "standby",
      label: "75% Full"
    },
  ];

  const list = document.getElementById("deviceList");
  list.innerHTML = devices.map(d => `
    <div class="device-item">
      <div class="device-icon">${d.icon}</div>
      <div>
        <div class="device-name">${d.name}</div>
        <div class="device-power">${d.power}</div>
      </div>
      <span class="device-status ${d.status}">${d.label}</span>
    </div>
  `).join("");
}

// ── Forecast ───────────────────────────────
let forecastData = generateForecast();

function renderForecast() {
  renderForecastChart();
  renderForecastTable();
}

function refreshForecast() {
  forecastData = generateForecast();
  renderForecast();
}

function renderForecastChart() {
  const ctx = document.getElementById("forecastChart");
  if (!ctx) return;

  if (charts["forecast"]) charts["forecast"].destroy();

  const labels = forecastData.map(f => f.label);
  const kwh    = forecastData.map(f => f.kwh);
  const cost   = forecastData.map(f => f.cost);

  charts["forecast"] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Forecast (kWh)",
          data: kwh,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,.1)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 3,
          yAxisID: "y",
        },
        {
          label: "Cost ($)",
          data: cost,
          borderColor: "#10b981",
          backgroundColor: "transparent",
          borderDash: [5, 4],
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 2,
          yAxisID: "y2",
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: "#9ca3af", font: { size: 12 }, usePointStyle: true }
        },
        tooltip: tooltipStyle(),
      },
      scales: {
        x: scaleStyle(),
        y: { ...scaleStyle(), title: { display: true, text: "kWh", color: "#6b7280" }, position: "left" },
        y2: { ...scaleStyle(), title: { display: true, text: "Cost ($)", color: "#6b7280" }, position: "right", grid: { drawOnChartArea: false } },
      }
    }
  });
}

function renderForecastTable() {
  const tbody = document.querySelector("#forecastTable tbody");
  tbody.innerHTML = forecastData.map(f => `
    <tr>
      <td>${f.label}</td>
      <td>${f.kwh.toFixed(3)}</td>
      <td><span class="tier tier-${f.tier}">${f.label_tier}</span></td>
      <td>$${f.rate.toFixed(2)}</td>
      <td>$${f.cost.toFixed(4)}</td>
    </tr>
  `).join("");
}

// ── History ────────────────────────────────
const allHistory = generateHistory();

function renderHistory() {
  const hours = parseInt(document.getElementById("hoursSelect").value);
  const data  = allHistory.slice(-hours);
  renderHistoryChart(data);
  renderHistoryTable(data);
}

function renderHistoryChart(data) {
  const ctx = document.getElementById("historyChart");
  if (!ctx) return;

  if (charts["history"]) charts["history"].destroy();

  const step   = data.length > 100 ? 2 : 1;
  const points = data.filter((_, i) => i % step === 0);

  charts["history"] = new Chart(ctx, {
    type: "line",
    data: {
      labels: points.map(r => {
        const d = new Date(r.time);
        return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit" });
      }),
      datasets: [
        {
          label: "Consumption (kWh)",
          data: points.map(r => r.kwh),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,.08)",
          fill: true,
          tension: 0.3,
          borderWidth: 1.5,
          pointRadius: 0,
          yAxisID: "y",
        },
        {
          label: "Temperature (°C)",
          data: points.map(r => r.temperature),
          borderColor: "#f59e0b",
          backgroundColor: "transparent",
          borderDash: [4, 3],
          tension: 0.3,
          borderWidth: 1.5,
          pointRadius: 0,
          yAxisID: "y2",
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: "#9ca3af", font: { size: 12 }, usePointStyle: true }
        },
        tooltip: tooltipStyle(),
      },
      scales: {
        x: {
          ...scaleStyle(),
          ticks: { ...scaleStyle().ticks, maxTicksLimit: 10, maxRotation: 45 }
        },
        y:  { ...scaleStyle(), title: { display: true, text: "kWh", color: "#6b7280" }, position: "left" },
        y2: { ...scaleStyle(), title: { display: true, text: "°C",  color: "#6b7280" }, position: "right", grid: { drawOnChartArea: false } },
      }
    }
  });
}

function renderHistoryTable(data) {
  const tbody = document.querySelector("#historyTable tbody");
  const slice = data.slice(-24).reverse();
  tbody.innerHTML = slice.map(r => `
    <tr>
      <td>${r.time}</td>
      <td>${r.kwh.toFixed(3)}</td>
      <td>${r.temperature}</td>
      <td>$${r.cost.toFixed(4)}</td>
    </tr>
  `).join("");
}

// ── Tips ───────────────────────────────────
function renderTips() {
  const hour = new Date().getHours();
  const tips = [
    {
      icon: "🌙",
      title: "Run Appliances at Night",
      text: "Electricity is cheapest between midnight and 7 AM ($0.08/kWh). Schedule laundry, dishwasher, and EV charging overnight to save up to 65% on those loads.",
      save: "Saves up to $0.50/day",
    },
    {
      icon: "❄️",
      title: "Pre-Cool Before Peak Hours",
      text: "Cool your home to 20°C before 5 PM when rates jump to $0.28/kWh. Your home stays cool during peak hours without running the AC as much.",
      save: "Saves up to $0.80/day",
    },
    {
      icon: "☀️",
      title: "Maximize Solar Self-Consumption",
      text: "Run your heaviest appliances between 10 AM and 2 PM when solar generation is at its peak. This reduces grid imports and maximizes your solar investment.",
      save: "Saves up to $1.20/day",
    },
    {
      icon: "🔌",
      title: "Eliminate Phantom Loads",
      text: "Devices on standby consume up to 10% of your electricity. Use smart power strips to completely cut power to TVs, game consoles, and chargers when not in use.",
      save: "Saves up to $0.30/day",
    },
    {
      icon: "🌡️",
      title: "Smart Thermostat Settings",
      text: "Set heating/cooling to 20°C when home and 18°C when away. Each degree of setback saves about 3% on heating/cooling costs.",
      save: "Saves up to $0.60/day",
    },
    {
      icon: "🚗",
      title: "Charge EV Off-Peak",
      text: "Charging your EV between midnight and 7 AM costs $0.08/kWh vs $0.28/kWh during peak. For a 50kWh battery, that is $10 savings per full charge.",
      save: "Saves $10 per charge",
    },
    {
      icon: "💡",
      title: "Switch to LED Lighting",
      text: "LED bulbs use 75% less energy than incandescent. Replacing 10 bulbs saves significant electricity especially during evening peak hours.",
      save: "Saves up to $0.20/day",
    },
    {
      icon: "🔋",
      title: "Use Battery Storage Wisely",
      text: "Charge your battery storage during off-peak or solar hours, then discharge during peak hours (5-10 PM) to avoid expensive grid electricity.",
      save: "Saves up to $2.00/day",
    },
  ];

  // Add time-specific tip
  if (hour >= 17 && hour < 22) {
    tips.unshift({
      icon: "⚡",
      title: "Peak Hours Alert!",
      text: "You are currently in peak pricing hours ($0.28/kWh). Avoid running dishwasher, laundry, or EV charger right now. Wait until after 10 PM.",
      save: "Act now to save money",
    });
  }

  document.getElementById("tipsList").innerHTML = tips.map(t => `
    <div class="tip-card">
      <div class="tip-icon">${t.icon}</div>
      <div>
        <p class="tip-title">${t.title}</p>
        <p class="tip-text">${t.text}</p>
        <p class="tip-save">💰 ${t.save}</p>
      </div>
    </div>
  `).join("");
}

// ── Chart Helpers ──────────────────────────
function tooltipStyle() {
  return {
    backgroundColor: "#1f2937",
    titleColor: "#f9fafb",
    bodyColor: "#9ca3af",
    borderColor: "#374151",
    borderWidth: 1,
    padding: 10,
  };
}

function scaleStyle() {
  return {
    grid:  { color: "rgba(255,255,255,.05)" },
    ticks: { color: "#6b7280", font: { size: 11 } },
  };
}

function chartOptions(yLabel = "kWh", showLegend = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        labels: { color: "#9ca3af" }
      },
      tooltip: tooltipStyle(),
    },
    scales: {
      x: scaleStyle(),
      y: {
        ...scaleStyle(),
        title: { display: true, text: yLabel, color: "#6b7280" }
      }
    }
  };
}