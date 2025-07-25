import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonText } from "../components/Skeleton";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import { Navbar } from "../components/navbar";

import { ErrorToast } from "../utils/toastHelper";
import { exportToExcel } from "../utils/exportToExcel";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/expenses")
      .then(res => setExpenses(res.data))
      .catch(err => ErrorToast(err.response?.data?.error || "Error fetching expenses"))
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    setDeleteId(id);
    setDeleteError(null);
    try {
      await api.delete(`/expenses/${id}`);
      setRefresh(r => !r);
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Error deleting expense");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (exp) => setEditing(exp);
  const handleView = (exp) => setViewing(exp);
  const closeEdit = () => setEditing(null);
  const closeView = () => setViewing(null);

  const handleUpdate = async (updated) => {
    try {
      await api.put(`/expenses/${editing._id}`, updated);
      setEditing(null);
      setRefresh(r => !r);
    } catch (err) {
      ErrorToast(err.response?.data?.error || "Error updating expense");
    }
  };

  if (loading) return (
    <div className="p-8 max-w-5xl mx-auto">
      <Skeleton width="40%" height={36} className="mb-6" />
      <Skeleton height={60} className="mb-6 rounded" />
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Skeleton width="160px" height={36} />
      </div>
      <div className="overflow-x-auto shadow">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="p-2 border"><Skeleton width="80px" /></td>
                <td className="p-2 border"><Skeleton width="60px" /></td>
                <td className="p-2 border"><Skeleton width="90px" /></td>
                <td className="p-2 border w-56"><Skeleton width="100%" height={32} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Download as Excel (CSV)
  const handleDownloadExcel = () => {
    exportToExcel({
      data: expenses.map(exp => ({
        category: exp.category,
        amount: exp.amount,
        date: exp.date ? new Date(exp.date).toLocaleDateString() : "-"
      })),
      columns: [
        { header: "Category", key: "category" },
        { header: "Amount", key: "amount" },
        { header: "Date", key: "date" },
      ],
      filename: "expenses.csv"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-pink-200">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-pink-800 drop-shadow">Expenses</h1>
        <ExpenseForm onSuccess={() => setRefresh(r => !r)} />
        {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <button
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition"
            onClick={handleDownloadExcel}
          >
            Download as CSV
          </button>
        </div>
        <div className="overflow-x-auto shadow">
          <table className="min-w-full border bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border w-56">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id} className="hover:bg-gray-50">
              <td className="p-2 border">{exp.category}</td>
              <td className="p-2 border">₹{exp.amount}</td>
              <td className="p-2 border">{exp.date ? new Date(exp.date).toLocaleDateString() : "-"}</td>
              <td className="p-2 border w-56">
                <div className="flex gap-2 w-full">
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    onClick={() => handleView(exp)}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold shadow hover:bg-yellow-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
                    onClick={() => handleEdit(exp)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 w-full ${deleteId===exp._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={deleteId===exp._id}
                    onClick={() => handleDelete(exp._id)}
                  >
                    {deleteId===exp._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
      
      {editing && (
        <div className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">Edit Expense</h2>
            <ExpenseForm
              onSuccess={() => { closeEdit(); setRefresh(r => !r); }}
              initial={editing}
              isEdit
              onSubmit={handleUpdate}
            />
            <button className="mt-2 text-gray-600 underline" onClick={closeEdit}>Cancel</button>
          </div>
        </div>
      )}
      
      {viewing && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-pink-700">Expense Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Category:</span>
                <span className="text-gray-900">{viewing.category}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Amount:</span>
                <span className="text-gray-900">₹{viewing.amount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Date:</span>
                <span className="text-gray-900">{viewing.date ? new Date(viewing.date).toLocaleDateString() : '-'}</span>
              </div>
              {viewing.notes && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Notes:</span>
                  <span className="text-gray-900">{viewing.notes}</span>
                </div>
              )}
              
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow transition mr-2"
                onClick={closeView}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ExpensePage };
