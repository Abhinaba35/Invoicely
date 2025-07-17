import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ErrorToast } from "../utils/toastHelper";

const ExpenseForm = ({ onSuccess, initial, isEdit, onSubmit }) => {
  const [form, setForm] = useState({ category: "", amount: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setError(null);
    try {
      if (isEdit && onSubmit) {
        await onSubmit({ ...form, amount: Number(form.amount) });
      } else {
        await api.post("/expenses", { ...form, amount: Number(form.amount) });
        setForm({ category: "", amount: "", date: "" });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      ErrorToast(err.response?.data?.error || "Error creating expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg mb-8 border border-pink-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-pink-700 drop-shadow">{isEdit ? "Edit Expense" : "Add Expense"}</h2>
      {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border border-pink-200 rounded-md py-2 px-3 text-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none transition" required />
        <input name="amount" type="number" min="0" value={form.amount} onChange={handleChange} placeholder="Amount" className="border border-pink-200 rounded-md py-2 px-3 text-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none transition" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} className="border border-pink-200 rounded-md py-2 px-3 text-pink-700 focus:ring-2 focus:ring-pink-400 focus:outline-none transition" required />
      </div>
      <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-semibold shadow transition" disabled={loading}>{loading ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Expense")}</button>
    </form>
  );
};

export default ExpenseForm; 