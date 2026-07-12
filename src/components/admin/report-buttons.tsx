"use client";

type CsvRow = Record<string, string | number>;

function toCsv(rows: CsvRow[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => {
    const s = String(value);
    return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h] ?? "")).join(",")),
  ].join("\n");
}

export function ExportCsvButton({ rows, filename }: { rows: CsvRow[]; filename: string }) {
  function handleExport() {
    const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={handleExport}>
      Export CSV
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      className="adm-btn adm-btn-outline adm-btn-sm"
      onClick={() => window.print()}
    >
      Cetak
    </button>
  );
}
