# 📊 Forex Economic Indicator Dashboard

A web-based dashboard that fetches and displays economic indicators for different regions (US, EU, Japan) and compares them to analyze currency pairs (EUR/USD, USD/JPY, EUR/JPY) using a scoring system.

## 🔹 Features

- Fetches real-time economic indicators (e.g., Inflation, GDP, Retail Sales) for US, EU, and Japan
- Displays indicators in separate tables per region
- Compares shared indicators between regions on a dedicated page
- Calculates a **numeric score** for each indicator comparison
- Displays **total score per currency pair** (bullish/bearish trend) in color-coded format
- Runs the **fetching script inside `server.js`**, eliminating the need for a separate fetch script

## 📁 Folder Structure
```
project-root/
│── public/
│   │── index.html          # Main dashboard with economic data tables
│   │── compare.html        # Comparison page for EUR/USD, USD/JPY, EUR/JPY
│   │── script.js           # Handles data fetching & display
│   │── compare.js          # Handles region comparison & scoring
│   │── styles.css          # Styling for tables and UI
│
│── data/
│   │── US/                # Economic indicators for the US
│   │── EU/                # Economic indicators for the EU
│   │── Japan/             # Economic indicators for Japan
│
│── server.js              # Express server that fetches data & serves static files
│── README.md              # Project documentation
│── package.json           # Node.js dependencies
```

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/forex-dashboard.git
   cd forex-dashboard
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Start the server**:
   ```sh
   node server.js
   ```
   The app will run at: `http://localhost:3000`

## 🔄 How It Works

### **1️⃣ Server (server.js)**
- Fetches economic indicators for **US, EU, and Japan**.
- Stores the data in region-specific folders (`data/US/`, `data/EU/`, `data/Japan/`).
- Serves `index.html` for viewing raw economic data per region.
- Serves `compare.html` for **comparing shared indicators** between two regions.

### **2️⃣ Main Dashboard (index.html + script.js)**
- Displays **economic indicators per region** in tables.
- Automatically colors positive/negative deviations.

### **3️⃣ Comparison Page (compare.html + compare.js)**
- Compares **EUR/USD, USD/JPY, EUR/JPY** using shared economic indicators.
- Assigns **numeric scores** (`+1`, `-1`, `0`) for each indicator.
- Displays **total score per currency pair** in color-coded format:
  - 🔵 **Positive Score** = Bullish
  - 🔴 **Negative Score** = Bearish
  - ⚫ **Zero Score** = Neutral

## ⚡ Example Output

**EUR/USD Comparison:**
| Indicator  | Score |
|------------|------------|
| Inflation  | `-1` |
| GDP Growth | `+1` |
| Retail Sales | `+1` |

✅ **Total EUR/USD Score: `+1` (🔵 Bullish)**

## 🛠 Future Improvements
- Add support for more economic indicators.
- Implement a **database** for historical tracking.
- Build a **live-updating UI** with WebSockets.
- Add **more forex pairs** for comparison.

---

**Made with ❤️ for forex traders & economic analysts!** ✨

