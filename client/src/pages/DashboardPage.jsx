import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonText } from "../components/Skeleton";
import api from "../services/api";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Navbar } from "../components/navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { ErrorToast } from "../utils/toastHelper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    api.get("/dashboard")
      .then(res => {
        setData(res.data);
        console.log("Dashboard API response:", res.data);
      })
      .catch(err => ErrorToast(err.response?.data?.error || "Error fetching dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 max-w-6xl mx-auto">
      <Skeleton width="40%" height={36} className="mb-6" />
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <Skeleton key={i} height={80} className="rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Skeleton height={340} className="rounded" />
        <Skeleton height={340} className="rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Skeleton height={260} className="rounded" />
        <Skeleton height={260} className="rounded" />
      </div>
    </div>
  );
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const allMonths = new Map();
  [...data.monthlyIncome, ...data.monthlyExpenses].forEach(item => {
    const label = `${months[item._id.month - 1]} '${String(item._id.year).slice(-2)}`;
    if (!allMonths.has(label)) {
      allMonths.set(label, { year: item._id.year, month: item._id.month, income: 0, expense: 0 });
    }
  });

  data.monthlyIncome.forEach(item => {
    const label = `${months[item._id.month - 1]} '${String(item._id.year).slice(-2)}`;
    if (allMonths.has(label)) {
      allMonths.get(label).income = item.total;
    }
  });

  data.monthlyExpenses.forEach(item => {
    const label = `${months[item._id.month - 1]} '${String(item._id.year).slice(-2)}`;
    if (allMonths.has(label)) {
      allMonths.get(label).expense = item.total;
    }
  });

  const sortedMonths = Array.from(allMonths.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const chartLabels = sortedMonths.map(item => `${months[item.month - 1]} '${String(item.year).slice(-2)}`);
  const incomeData = sortedMonths.map(item => item.income);
  const expenseData = sortedMonths.map(item => item.expense);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-white to-blue-400">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-emerald-800 drop-shadow">Dashboard</h1>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-100 p-4 rounded shadow flex flex-col items-center">
            <div className="text-lg">Total Income</div>
            <div className="text-2xl font-bold">₹{data.totalIncome}</div>
          </div>
          <div className="bg-red-100 p-4 rounded shadow flex flex-col items-center">
            <div className="text-lg">Total Expenses</div>
            <div className="text-2xl font-bold">₹{data.totalExpenses}</div>
          </div>
          <div className="bg-blue-200 p-4 rounded shadow flex flex-col items-center">
            <div className="text-lg">Total Balance</div>
            <div className="text-2xl font-bold">₹{data.totalBalance}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Yearly Income vs Expenses Chart */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2 text-center">Yearly Income vs Expenses</h2>
            <p className="text-sm text-gray-500 mb-2">(Income is based on paid invoices)</p>
            <div style={{ width: '100%', height: 340 }}>
              {chartLabels.length > 0 ? (
                <Bar
                  key={JSON.stringify(chartLabels) + JSON.stringify(incomeData) + JSON.stringify(expenseData)}
                  data={{
                    labels: chartLabels,
                    datasets: [
                      {
                        label: "Income",
                        data: incomeData,
                        backgroundColor: "rgba(16, 185, 129, 0.7)",
                        borderRadius: 8,
                        barThickness: 28,
                      },
                      {
                        label: "Expenses",
                        data: expenseData,
                        backgroundColor: "rgba(239, 68, 68, 0.7)",
                        borderRadius: 8,
                        barThickness: 28,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                    },
                    scales: {
                      x: { grid: { display: false } },
                      y: { grid: { color: "#e5e7eb" } },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No income or expense data available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Clients with better CSS */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2 text-center">Top Clients</h2>
            <ul className="divide-y divide-gray-200 w-full max-w-xs mx-auto">
              {data.topClients.length === 0 && <li className="text-gray-400 text-center py-4">No clients yet</li>}
              {data.topClients.map((c, i) => (
                <li key={c._id} className="flex items-center justify-between py-3 px-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-emerald-50 rounded-lg transition">
                  <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-full text-center font-bold mr-2 flex items-center justify-center shadow"
                      style={{
                        background: `linear-gradient(135deg, #6366f1 0%, #10b981 100%)`,
                        color: '#fff',
                        fontSize: '1.1rem',
                      }}
                    >{i+1}</span>
                    {c._id || <span className="italic text-gray-400">Unknown</span>}
                  </span>
                  <span className="font-bold text-indigo-700">₹{c.total}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category-wise and Invoice Status Pie Charts in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Category-wise Expense Pie Chart */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2 text-center">Category-wise Expenses</h2>
            <div style={{ width: 260, height: 260 }}>
              <Pie
                key={JSON.stringify(data.categoryExpenses)}
                data={{
                  labels: data.categoryExpenses.map(c => c._id),
                  datasets: [
                    {
                      data: data.categoryExpenses.map(c => c.total),
                      backgroundColor: [
                        "#6366f1",
                        "#f59e42",
                        "#10b981",
                        "#f43f5e",
                        "#38bdf8",
                        "#fbbf24",
                        "#a21caf",
                        "#eab308",
                        "#14b8a6",
                        "#f472b6"
                      ],
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { position: "bottom" },
                  },
                  maintainAspectRatio: false,
                }}
                style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', borderRadius: 16, border: '1px solid #e5e7eb' }}
              />
            </div>
          </div>
          {/* Invoice Status Pie Chart */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2 text-center">Invoice Status</h2>
            <div style={{ width: 260, height: 260 }}>
              <Pie
                key={JSON.stringify(data.statusBreakdown)}
                data={{
                  labels: data.statusBreakdown.map(s => s._id),
                  datasets: [
                    {
                      data: data.statusBreakdown.map(s => s.count),
                      backgroundColor: [
                        "#6366f1",
                        "#10b981",
                        "#f43f5e",
                        "#f59e42",
                        "#38bdf8",
                        "#a21caf",
                        "#eab308",
                        "#14b8a6",
                        "#f472b6"
                      ],
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { position: "bottom" },
                  },
                  maintainAspectRatio: false,
                }}
                style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', borderRadius: 16, border: '1px solid #e5e7eb' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DashboardPage};
