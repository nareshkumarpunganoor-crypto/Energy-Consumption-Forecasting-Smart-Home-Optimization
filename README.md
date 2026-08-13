# ⚡ Energy Consumption Forecasting & Smart Home Optimization

## Project Description

This project is a **Smart Home Energy Dashboard** built with 
HTML, CSS, and JavaScript. It forecasts household energy 
consumption, tracks device usage, and gives personalized 
tips to reduce electricity bills — all running locally 
in your browser with no server or internet required.

---

## What This Project Does

### 1. Dashboard
- Shows real-time stats like current power, today's usage,
  today's cost, temperature, and solar generation
- Displays average hourly consumption bar chart
  colour coded by pricing tier
- Shows live status of all home devices
- Appliance breakdown doughnut chart

### 2. Forecast Tab
- Predicts next 24 hours of energy consumption
- Line chart showing predicted kWh and estimated cost
- Full hourly table with pricing tier badges
- Refresh button to generate new forecast

### 3. History Tab
- Shows past consumption and temperature data
- Dual axis chart (kWh + temperature)
- Select last 24 hours, 48 hours, 72 hours, or 7 days
- Scrollable data table

### 4. Tips Tab
- Personalized energy saving recommendations
- Time-aware alerts (example: peak hour warning at 5 PM)
- Estimated savings for each tip

---

## Key Features

| Feature | Detail |
|---------|--------|
| No Backend | Runs purely in the browser |
| No Server | Just open index.html |
| No Installation | No pip install or npm needed |
| Dark Theme | Clean modern dark UI |
| Responsive | Works on desktop and mobile |
| Live Updates | Cards refresh every 5 seconds |
| Charts | Built with Chart.js |
| Time Aware | Tips and device status change by hour |

---

## Electricity Pricing Model

| Tier | Hours | Rate |
|------|-------|------|
| Off-Peak | 00:00 - 07:00 | $0.08 per kWh |
| Mid-Peak | 07:00 - 17:00 | $0.15 per kWh |
| Peak | 17:00 - 22:00 | $0.28 per kWh |

---

## Consumption Pattern Used

| Time | Base Load | Reason |
|------|-----------|--------|
| 00:00 - 06:00 | 0.5 kWh | Night, low usage |
| 06:00 - 09:00 | 2.5 kWh | Morning, breakfast |
| 09:00 - 17:00 | 1.2 kWh | Daytime, moderate |
| 17:00 - 22:00 | 3.5 kWh | Evening, peak usage |
| 22:00 - 24:00 | 1.0 kWh | Late night, winding down |

---

## Devices Monitored

| Device | Icon | Smart Scheduling |
|--------|------|-----------------|
| HVAC | ❄️ | Always monitored |
| Lighting | 💡 | On after 6 PM |
| Kitchen | 🍳 | Active at meal times |
| Entertainment | 📺 | On after 6 PM |
| Water Heater | 🚿 | Active at 6-7 AM and 6-7 PM |
| EV Charger | 🚗 | Charges after 10 PM |
| Solar Inverter | ☀️ | Active during daylight |
| Battery Storage | 🔋 | Shows charge level |

---

## Energy Saving Tips Included

1. Run appliances at night (off-peak hours)
2. Pre-cool home before peak pricing starts
3. Maximize solar self-consumption (10 AM - 2 PM)
4. Eliminate phantom loads with smart power strips
5. Smart thermostat settings (20C home, 18C away)
6. Charge EV overnight for cheapest rates
7. Switch to LED lighting
8. Use battery storage during peak hours
9. Peak hour alert when pricing is highest

---

## Files in This Project

| File | Purpose |
|------|---------|
| index.html | Main dashboard structure and layout |
| style.css | Dark theme styling and responsive design |
| app.js | All logic, data generation, and charts |

---

## How to Run
Step 1 - Download all 3 files
Step 2 - Put them in the same folder
Step 3 - Double click index.html
Step 4 - Opens in your browser
Step 5 - Done. No setup needed.

---

## How to Run Fully Offline
Step 1 - Download Chart.js from CDN
https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js
Step 2 - Save it as chart.min.js in the same folder
Step 3 - Open index.html
Step 4 - Change the script tag in index.html to:
<script src="chart.min.js"></script>
Step 5 - Now works with zero internet

---

## Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | Latest | Page structure |
| CSS3 | Latest | Styling and layout |
| JavaScript | ES6+ | Logic and interactivity |
| Chart.js | 4.4.0 | Charts and graphs |

---

## Project Goals

- Help homeowners understand their energy usage
- Show when electricity is cheapest to run appliances
- Provide actionable tips to reduce electricity bills
- Demonstrate time-of-use pricing impact
- Visualize solar generation benefits
- Track all smart home devices in one dashboard

---

## Potential Improvements

- Connect to real smart meter API
- Add user login and data persistence
- Export data as CSV or PDF report
- Add monthly and yearly trend charts
- Send email alerts during peak hours
- Add battery storage optimization
- Connect to weather API for real temperatures
- Add appliance scheduling calendar

---

## Author

**Naresh Kumar**
GitHub: https://github.com/nareshkumarpunganoor-crypto

---

## License

MIT License
Free to use, modify, and distribute.

---

## Live Demo

https://energy-consumption-forecasting-smart-home-optimi-production.up.railway.app