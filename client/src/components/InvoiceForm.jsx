import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ErrorToast } from "../utils/toastHelper";

const InvoiceForm = ({ onSuccess, initial, isEdit, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    client: { name: "", email: "", address: "" },
    items: [{ description: "", quantity: 1, price: 0, tax: 0 }],
    dueDate: "",
    status: "unpaid",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("client.")) {
      setForm(f => ({ ...f, client: { ...f.client, [name.split(".")[1]]: value } }));
    } else if (name.startsWith("item.")) {
      setForm(f => ({
        ...f,
        items: [{ ...f.items[0], [name.split(".")[1]]: value }]
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const item = form.items[0];
      const total = (Number(item.price) * Number(item.tax) / 100) + (Number(item.price) * Number(item.quantity));
      if (isEdit && onSubmit) {
        await onSubmit({ ...form, total });
      } else {
        await api.post("/invoices", { ...form, total });
        setForm({ client: { name: "", email: "", address: "" }, items: [{ description: "", quantity: 1, price: 0, tax: 0 }], dueDate: "", status: "pending" });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      ErrorToast(err.response?.data?.error || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg mb-8 border border-blue-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 drop-shadow">{isEdit ? "Edit Invoice" : "Create Invoice"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Client Name</label>
          <input name="client.name" value={form.client.name} onChange={handleChange} placeholder="Client Name" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
        </div>
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Client Email</label>
          <input name="client.email" value={form.client.email} onChange={handleChange} placeholder="Client Email" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
        </div>
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Client Address</label>
          <input name="client.address" value={form.client.address} onChange={handleChange} placeholder="Client Address" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Item Description</label>
          <input name="item.description" value={form.items[0].description} onChange={handleChange} placeholder="Item Description" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
        </div>
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Quantity</label>
          <input name="item.quantity" type="number" min="1" value={form.items[0].quantity} onChange={handleChange} placeholder="Qty" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
        </div>
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Price</label>
          <input name="item.price" type="number" min="0" value={form.items[0].price} onChange={handleChange} placeholder="Price" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" required />
        </div>
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium text-blue-700">Tax</label>
          <input name="item.tax" type="number" min="0" value={form.items[0].tax} onChange={handleChange} placeholder="Tax" className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
        </div>
      </div>
      <div className="flex flex-col text-left">
        <label className="mb-1 font-medium text-blue-700">Due Date</label>
        <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition" />
      </div>
      <div className="flex flex-col text-left">
        <label className="mb-1 font-medium text-blue-700">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border border-blue-200 rounded-md py-2 px-3 text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          required
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300">Cancel</button>}
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition" disabled={loading}>{loading ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save Changes" : "Create Invoice")}</button>
      </div>
    </form>
  );
};

export default InvoiceForm;
