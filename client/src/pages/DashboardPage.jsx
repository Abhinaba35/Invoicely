import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Bar } from "react-chartjs-2";
import { Navbar } from "../components/navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || "Error fetching dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  // Prepare chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const incomeData = Array(6).fill(0);
  const expenseData = Array(6).fill(0);
  let chartLabels = [];
  if (data.monthlyIncome.length || data.monthlyExpenses.length) {
    // Get all months in the last 6 months
    const all = [...data.monthlyIncome, ...data.monthlyExpenses];
    const sorted = all.sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });
    chartLabels = sorted.map(x => `${months[x._id.month - 1]} '${String(x._id.year).slice(-2)}`);
    // Fill income/expense data
    data.monthlyIncome.forEach((x, i) => {
      incomeData[i] = x.total;
    });
    data.monthlyExpenses.forEach((x, i) => {
      expenseData[i] = x.total;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-emerald-800 drop-shadow">Dashboard</h1>
        <div className="mb-6 flex gap-8">
          <div className="bg-green-100 p-4 rounded shadow">
            <div className="text-lg">Total Income</div>
            <div className="text-2xl font-bold">₹{data.totalIncome}</div>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <div className="text-lg">Total Expenses</div>
            <div className="text-2xl font-bold">₹{data.totalExpenses}</div>
          </div>
        </div>
        {chartLabels.length > 0 && (
          <div className="mb-8 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Monthly Income vs Expenses</h2>
            <Bar
              data={{
                labels: chartLabels,
                datasets: [
                  {
                    label: "Income",
                    data: incomeData,
                    backgroundColor: "#4ade80",
                  },
                  {
                    label: "Expenses",
                    data: expenseData,
                    backgroundColor: "#f87171",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: false },
                },
              }}
            />
          </div>
        )}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Top Clients</h2>
          <ul>
            {data.topClients.map(c => (
              <li key={c._id}>{c._id}: ₹{c.total}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Invoice Status</h2>
          <ul>
            {data.statusBreakdown.map(s => (
              <li key={s._id}>{s._id}: {s.count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { DashboardPage}; 