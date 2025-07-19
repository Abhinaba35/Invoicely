// Utility to export data to Excel (CSV)
export function exportToExcel({ data, columns, filename }) {
  if (!data || !columns || data.length === 0) return;
  const csvRows = [];
  // Header
  csvRows.push(columns.map(col => col.header).join(","));
  // Data
  data.forEach(row => {
    csvRows.push(columns.map(col => {
      let val = row[col.key];
      if (val === undefined || val === null) return '';
      if (typeof val === 'string') return '"' + val.replace(/"/g, '""') + '"';
      return val;
    }).join(","));
  });
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
