# AgRo Greenhouse Dashboard 🌿

A **frontend analytical dashboard** built using **React.js** to visualize environmental data such as **Temperature**, **Humidity**, and **Light Intensity** on interactive charts.

This project provides a simple, responsive user interface for monitoring greenhouse conditions and analyzing sensor data visually.

---

## 🎯 Project Overview
The dashboard displays three key environmental parameters in real-time or from uploaded datasets (depending on data source configuration):
- 🌡️ Temperature
- 💧 Humidity
- ☀️ Light Intensity

Each parameter is represented using a clean and dynamic line chart, offering a quick view of environmental trends.

---

## 🧰 Tech Stack
- **Frontend Framework:** React.js  
- **Styling:** CSS  
- **Chart Library:** Recharts / Chart.js (based on your implementation)  
- **Data Source:** Firebase Realtime Database (frontend connection only)

---

## 📁 Folder Structure
AgRo-Greenhouse-Dashboard/
│
├── public/ # Static assets (index.html, favicon, etc.)
├── src/ # React components and logic
│ ├── App.js # Main dashboard logic
│ ├── firebase.js # Firebase frontend connection (if used)
│ ├── components/ # Chart components
│ ├── styles/ # CSS files
│
├── package.json # Dependencies and scripts
├── .gitignore
└── README.md
