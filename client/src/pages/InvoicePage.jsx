import React, { useEffect, useState } from "react";
import api from "../services/api";
import InvoiceForm from "../components/InvoiceForm";
import { Navbar } from "../components/navbar";
import { ErrorToast } from "../utils/toastHelper";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get("/invoices")
      .then(res => setInvoices(res.data))
      .catch(err => ErrorToast(err.response?.data?.error || "Error fetching invoices"))
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    setDeleteId(id);
    setDeleteError(null);
    try {
      await api.delete(`/invoices/${id}`);
      setRefresh(r => !r);
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Error deleting invoice");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (inv) => setEditing(inv);
  const handleView = (inv) => setViewing(inv);
  const closeEdit = () => setEditing(null);
  const closeView = () => setViewing(null);

  const handleUpdate = async (updated) => {
    try {
      await api.put(`/invoices/${editing._id}`, updated);
      setEditing(null);
      setRefresh(r => !r);
    } catch (err) {
      ErrorToast(err.response?.data?.error || "Error updating invoice");
    }
  };

  if (loading) return <div className="p-8">Loading invoices...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 drop-shadow">Invoices</h1>
        <InvoiceForm onSuccess={() => setRefresh(r => !r)} />
        {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
        <div className="overflow-x-auto shadow">
          <table className="min-w-full border bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Due Date</th>
            <th className="p-2 border w-56">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv._id} className="hover:bg-gray-50">
              <td className="p-2 border">{inv.client?.name}</td>
              <td className="p-2 border">₹{inv.total}</td>
              <td className="p-2 border">{inv.status}</td>
              <td className="p-2 border">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}</td>
              <td className="p-2 border w-56">
                <div className="flex gap-2 w-full">
                  <button
                    className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    onClick={() => handleView(inv)}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold shadow hover:bg-yellow-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
                    onClick={() => handleEdit(inv)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded bg-red-100 text-red-700 font-semibold shadow hover:bg-red-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 w-full ${deleteId===inv._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={deleteId===inv._id}
                    onClick={() => handleDelete(inv._id)}
                  >
                    {deleteId===inv._id ? "Deleting..." : "Delete"}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-2">Edit Invoice</h2>
            <InvoiceForm
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Invoice Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Client:</span>
                <span className="text-gray-900">{viewing.client?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-900">{viewing.client?.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="text-gray-900">{viewing.client?.address}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Total:</span>
                <span className="text-gray-900">₹{viewing.total}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className="text-gray-900">{viewing.status}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700">Due Date:</span>
                <span className="text-gray-900">{viewing.dueDate ? new Date(viewing.dueDate).toLocaleDateString() : '-'}</span>
              </div>
              {viewing.items && viewing.items.length > 0 && (
                <div className="border-b pb-2">
                  <span className="font-semibold text-gray-700 block mb-1">Item:</span>
                  <div className="pl-2 text-gray-900 text-sm">
                    {viewing.items[0].description} (Qty: {viewing.items[0].quantity}, Price: ₹{viewing.items[0].price}, Tax: ₹{viewing.items[0].tax})
                  </div>
                </div>
              )}
            </div>
            <button className="mt-4 text-blue-700 underline font-semibold" onClick={closeView}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export { InvoicePage }; 