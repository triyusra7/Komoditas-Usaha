import { describe, expect, it } from "vitest";

import {
  computeBalanceSheet,
  computeCashFlow,
  computeIncomeStatement,
  computeRatios,
  type AccountBalanceRow,
} from "./financial-statements";

// Seed scenario loosely modeled on the business plan numbers referenced in
// PRD-2: Rp 200jt investor capital, Rp 300jt bank loan, ~Rp 280.8jt CAPEX.
const seedRows: AccountBalanceRow[] = [
  { code: "1100", name: "Kas", type: "asset", normalSide: "debit", debit: 600_000_000, credit: 375_800_000 }, // 224.2jt
  { code: "1400", name: "Persediaan Ternak", type: "asset", normalSide: "debit", debit: 40_000_000, credit: 30_000_000 }, // 10jt
  { code: "1500", name: "Aset Tetap", type: "asset", normalSide: "debit", debit: 280_800_000, credit: 0 },
  { code: "2200", name: "Utang Bank", type: "liability", normalSide: "credit", debit: 0, credit: 300_000_000 },
  { code: "3200", name: "Modal Investor", type: "equity", normalSide: "credit", debit: 0, credit: 200_000_000 },
  { code: "4100", name: "Pendapatan Penjualan", type: "income", normalSide: "credit", debit: 0, credit: 50_000_000 },
  { code: "5100", name: "Harga Pokok Penjualan (HPP)", type: "expense", normalSide: "debit", debit: 30_000_000, credit: 0 },
  { code: "5300", name: "Beban Operasional", type: "expense", normalSide: "debit", debit: 5_000_000, credit: 0 },
];

describe("computeIncomeStatement", () => {
  it("computes net income as total income minus total expense", () => {
    const statement = computeIncomeStatement(seedRows);
    expect(statement.totalIncome).toBe(50_000_000);
    expect(statement.totalExpense).toBe(35_000_000);
    expect(statement.netIncome).toBe(15_000_000);
  });
});

describe("computeBalanceSheet", () => {
  it("balances assets against liabilities + equity (including unclosed net income)", () => {
    const sheet = computeBalanceSheet(seedRows);
    expect(sheet.totalAssets).toBe(515_000_000);
    expect(sheet.totalLiabilities).toBe(300_000_000);
    // 200jt recorded equity + 15jt retained earnings (net income) = 215jt
    expect(sheet.totalEquity).toBe(215_000_000);
    expect(sheet.isBalanced).toBe(true);
  });

  it("flags an unbalanced sheet as such", () => {
    const brokenRows: AccountBalanceRow[] = [
      { code: "1100", name: "Kas", type: "asset", normalSide: "debit", debit: 100, credit: 0 },
      { code: "3100", name: "Modal Pemilik", type: "equity", normalSide: "credit", debit: 0, credit: 50 },
    ];
    expect(computeBalanceSheet(brokenRows).isBalanced).toBe(false);
  });
});

describe("computeCashFlow", () => {
  it("buckets cash mutations into operating / investing / financing", () => {
    const cashFlow = computeCashFlow([
      { sourceType: "investor_contribution", debit: 200_000_000, credit: 0 },
      { sourceType: "bank_loan", debit: 300_000_000, credit: 0 },
      { sourceType: "purchase_asset", debit: 0, credit: 280_800_000 },
      { sourceType: "purchase_livestock", debit: 0, credit: 40_000_000 },
      { sourceType: "sale", debit: 50_000_000, credit: 0 },
      { sourceType: "opex", debit: 0, credit: 5_000_000 },
    ]);

    expect(cashFlow.financing).toBe(500_000_000);
    expect(cashFlow.investing).toBe(-280_800_000);
    expect(cashFlow.operating).toBe(50_000_000 - 40_000_000 - 5_000_000);
    expect(cashFlow.netChangeInCash).toBe(
      cashFlow.operating + cashFlow.investing + cashFlow.financing,
    );
  });

  it("matches the net change in the actual Kas account balance for the same period", () => {
    const cashFlow = computeCashFlow([
      { sourceType: "investor_contribution", debit: 200_000_000, credit: 0 },
      { sourceType: "bank_loan", debit: 300_000_000, credit: 0 },
      { sourceType: "purchase_asset", debit: 0, credit: 280_800_000 },
      { sourceType: "purchase_livestock", debit: 0, credit: 40_000_000 },
      { sourceType: "sale", debit: 50_000_000, credit: 0 },
      { sourceType: "opex", debit: 0, credit: 5_000_000 },
    ]);
    // Kas row above: 600,000,000 debit - 375,800,000 credit = 224,200,000
    expect(cashFlow.netChangeInCash).toBe(224_200_000);
  });
});

describe("computeRatios", () => {
  it("computes margin, ROE, and DER against known numbers", () => {
    const incomeStatement = computeIncomeStatement(seedRows);
    const balanceSheet = computeBalanceSheet(seedRows);
    const ratios = computeRatios(incomeStatement, balanceSheet, {
      principalPaid: 4_000_000,
      interestPaid: 500_000,
    });

    expect(ratios.netProfitMargin).toBe(0.3); // 15jt / 50jt
    expect(ratios.returnOnEquity).toBeCloseTo(15_000_000 / 215_000_000, 4);
    expect(ratios.debtToEquityRatio).toBeCloseTo(300_000_000 / 215_000_000, 4);
    expect(ratios.debtServiceCoverageRatio).toBeCloseTo(15_000_000 / 4_500_000, 4);
  });

  it("returns null ratios instead of dividing by zero when there is no equity or revenue", () => {
    const emptyIncomeStatement = computeIncomeStatement([]);
    const emptyBalanceSheet = computeBalanceSheet([]);
    const ratios = computeRatios(emptyIncomeStatement, emptyBalanceSheet);

    expect(ratios.netProfitMargin).toBeNull();
    expect(ratios.returnOnEquity).toBeNull();
    expect(ratios.debtToEquityRatio).toBeNull();
    expect(ratios.debtServiceCoverageRatio).toBeNull();
  });
});
