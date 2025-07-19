import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonText } from "../components/Skeleton";
import api from "../services/api";
import InvoiceForm from "../components/InvoiceForm";
import { Navbar } from "../components/navbar";

import { ErrorToast } from "../utils/toastHelper";
import { exportToExcel } from "../utils/exportToExcel";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

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

  if (loading) return (
    <div className="p-8 max-w-5xl mx-auto">
      <Skeleton width="40%" height={36} className="mb-6" />
      <Skeleton height={60} className="mb-6 rounded" />
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Skeleton width="180px" height={36} />
        <Skeleton width="160px" height={36} />
      </div>
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
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="p-2 border"><Skeleton width="80px" /></td>
                <td className="p-2 border"><Skeleton width="60px" /></td>
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
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  // Filtered invoices
  const filteredInvoices = statusFilter
    ? invoices.filter(inv => inv.status === statusFilter)
    : invoices;

  // Get unique statuses for filter dropdown
  const statusOptions = Array.from(new Set(invoices.map(inv => inv.status))).filter(Boolean);

  // Download as Excel (CSV)
  const handleDownloadExcel = () => {
    exportToExcel({
      data: filteredInvoices.map(inv => ({
        client: inv.client?.name,
        total: inv.total,
        status: inv.status,
        dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"
      })),
      columns: [
        { header: "Client", key: "client" },
        { header: "Total", key: "total" },
        { header: "Status", key: "status" },
        { header: "Due Date", key: "dueDate" },
      ],
      filename: "invoices.csv"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-blue-300">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 drop-shadow">Invoices</h1>
        <InvoiceForm onSuccess={() => setRefresh(r => !r)} />
        {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex gap-2 items-center">
            <label className="font-medium text-gray-700">Filter by Status:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <button
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition"
            onClick={handleDownloadExcel}
          >
            Download as csv
          </button>
        </div>
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
          {filteredInvoices.map(inv => (
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
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Invoice Details</h2>
            <div id="invoice-print-area" className="space-y-3">
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
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition mr-2"
                onClick={closeView}
              >
                Close
              </button>
              <button
                className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition"
                onClick={() => {
                  const printContents = document.getElementById('invoice-print-area').innerHTML;
                  const win = window.open('', '', 'height=700,width=700');
                  win.document.write(`<!DOCTYPE html><html><head><title>Invoice</title><style>
                    body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; color: #222; margin: 0; padding: 2rem; }
                    .invoice-box { background: #fff; border-radius: 1rem; box-shadow: 0 2px 16px #0001; padding: 2rem; max-width: 400px; margin: 2rem auto; }
                    .invoice-box h2 { color: #2563eb; margin-bottom: 1.5rem; }
                    .invoice-row { display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; padding: 0.5rem 0; }
                    .invoice-label { font-weight: 600; color: #334155; }
                    .invoice-value { color: #0f172a; }
                    .invoice-item { margin-top: 1rem; font-size: 0.98rem; color: #334155; }
                  </style></head><body><div class='invoice-box'>`);
                  win.document.write(`<h2>Invoice Details</h2>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Client:</span><span class='invoice-value'>${viewing.client?.name || ''}</span></div>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Email:</span><span class='invoice-value'>${viewing.client?.email || ''}</span></div>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Address:</span><span class='invoice-value'>${viewing.client?.address || ''}</span></div>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Total:</span><span class='invoice-value'>₹${viewing.total}</span></div>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Status:</span><span class='invoice-value'>${viewing.status}</span></div>`);
                  win.document.write(`<div class='invoice-row'><span class='invoice-label'>Due Date:</span><span class='invoice-value'>${viewing.dueDate ? new Date(viewing.dueDate).toLocaleDateString() : '-'}</span></div>`);
                  if (viewing.items && viewing.items.length > 0) {
                    win.document.write(`<div class='invoice-item'><b>Item:</b> ${viewing.items[0].description} (Qty: ${viewing.items[0].quantity}, Price: ₹${viewing.items[0].price}, Tax: ₹${viewing.items[0].tax})</div>`);
                  }
                  win.document.write(`</div></body></html>`);
                  win.document.close();
                  win.focus();
                  setTimeout(() => { win.print(); win.close(); }, 500);
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { InvoicePage }; 