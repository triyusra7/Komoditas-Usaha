const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export type MonthPeriod = {
  periode: string; // "2026-07"
  from: string; // "2026-07-01"
  to: string; // "2026-07-31"
  label: string; // "Juli 2026"
};

/** Parses a "YYYY-MM" period (from <input type=month>), defaulting to the current month. */
export function resolveMonthPeriod(periode?: string): MonthPeriod {
  const fallback = new Date().toISOString().slice(0, 7);
  const value = /^\d{4}-\d{2}$/.test(periode ?? "") ? (periode as string) : fallback;
  const [year, month] = value.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    periode: value,
    from: `${value}-01`,
    to: `${value}-${String(lastDay).padStart(2, "0")}`,
    label: `${MONTH_NAMES[month - 1]} ${year}`,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}
