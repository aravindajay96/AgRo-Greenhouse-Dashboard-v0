import React, { useEffect, useState, useMemo } from "react";
import { db, ref, onValue } from "./firebase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Utility to format time labels nicely
const formatTime = (timestamp, range) => {
  const date = new Date(timestamp);

  switch (range) {
    case "1d":
    case "5d":
      // show hours:minutes
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    case "1m":
    case "3m":
    case "6m":
      // show day + short month
      return date.toLocaleDateString([], { day: "2-digit", month: "short" });

    case "1y":
    case "all":
      // show month + year
      return date.toLocaleDateString([], { month: "short", year: "numeric" });

    default:
      return date.toLocaleString();
  }
};

function resampleData(data, timeWindow) {
  if (!data.length) return [];

  // Decide interval
  let interval = "hour";
  if (["1m", "3m", "6m", "1y", "all"].includes(timeWindow)) {
    interval = "day";
  }

  const intervalMs = interval === "day"
    ? 24 * 60 * 60 * 1000
    : 60 * 60 * 1000; // default = hour

  const resampled = [];
  const start = Math.floor(data[0].time / intervalMs) * intervalMs;
  const end = Math.ceil(data[data.length - 1].time / intervalMs) * intervalMs;

  let dataIndex = 0;

  for (let t = start; t <= end; t += intervalMs) {
    const record = data[dataIndex];
    if (record && Math.floor(record.time / intervalMs) * intervalMs === t) {
      resampled.push(record);
      dataIndex++;
    } else {
      resampled.push({
        time: t,
        humidity: 0,
        light: 0,
        temperature: 0,
      });
    }
  }

  return resampled;
}



function App() {
  const [data, setData] = useState([]);
  const [timeWindow, setTimeWindow] = useState("1d");

  useEffect(() => {
    const sensorRef = ref(db, "sensorData");
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const rawData = snapshot.val();
      console.log("Raw Firebase Data:", rawData);  // 👈 ADD THIS
      if (rawData) {
        const formatted = Object.keys(rawData)
  .map((key) => {
    // Key is like "20250206_170002"
    const dateStr = key; 
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months 0–11
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(9, 11));
    const minute = parseInt(dateStr.substring(11, 13));
    const second = parseInt(dateStr.substring(13, 15));

    const timestamp = new Date(year, month, day, hour, minute, second).getTime();

    return {
      time: timestamp,
      humidity: rawData[key].humidity,
      light: rawData[key].light,
      temperature: rawData[key].temperature,
    };
  })
  .sort((a, b) => a.time - b.time);

        setData(formatted);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  // Filter data based on selected time window
  const filteredData = useMemo(() => {
  if (!data.length) return [];

  const now = Date.now();
  let cutoff = 0;

  switch (timeWindow) {
    case "1d": cutoff = now - 1 * 24 * 60 * 60 * 1000; break;
    case "5d": cutoff = now - 5 * 24 * 60 * 60 * 1000; break;
    case "1m": cutoff = now - 30 * 24 * 60 * 60 * 1000; break;
    case "3m": cutoff = now - 90 * 24 * 60 * 60 * 1000; break;
    case "6m": cutoff = now - 180 * 24 * 60 * 60 * 1000; break;
    case "1y": cutoff = now - 365 * 24 * 60 * 60 * 1000; break;
    default: cutoff = 0;
  }

  const windowData = data.filter((d) => d.time >= cutoff);

  // 👇 Resample depending on timeWindow
  return resampleData(windowData, timeWindow);
}, [data, timeWindow]);



  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
  <h2>🌱 AgRo Greenhouse 🌱</h2>

      {/* Time range selector */}
      <div style={{ marginBottom: "20px" }}>
        <label>Time Range: </label>
        <select value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
          <option value="1d">1 Day</option>
          <option value="5d">5 Days</option>
          <option value="1m">1 Month</option>
          <option value="3m">3 Months</option>
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* Humidity Chart */}
      <h3>💧 Humidity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            tickFormatter={(t) => formatTime(t, timeWindow)}
          />
          <YAxis />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
          <Line type="monotone" dataKey="humidity" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      {/* Light Chart */}
      <h3>💡 Light</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            tickFormatter={(t) => formatTime(t, timeWindow)}
          />
          <YAxis />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
          <Line type="monotone" dataKey="light" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      {/* Temperature Chart */}
      <h3>🌡️ Temperature</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            tickFormatter={(t) => formatTime(t, timeWindow)}
          />
          <YAxis />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
          <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
