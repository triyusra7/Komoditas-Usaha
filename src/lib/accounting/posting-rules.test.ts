import { describe, expect, it } from "vitest";

import { buildJournalLines, CHART_OF_ACCOUNTS_CODES as ACCOUNT } from "./posting-rules";

function totalDebit(lines: { debit: number }[]): number {
  return lines.reduce((sum, l) => sum + l.debit, 0);
}

function totalCredit(lines: { credit: number }[]): number {
  return lines.reduce((sum, l) => sum + l.credit, 0);
}

describe("buildJournalLines", () => {
  it("posts a cash sale as Debit Kas / Kredit Pendapatan", () => {
    const lines = buildJournalLines({ type: "sale", amount: 500_000, isCash: true });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.kas, debit: 500_000, credit: 0 },
      { accountCode: ACCOUNT.pendapatanPenjualan, debit: 0, credit: 500_000 },
    ]);
  });

  it("posts a credit sale as Debit Piutang / Kredit Pendapatan", () => {
    const lines = buildJournalLines({ type: "sale", amount: 500_000, isCash: false });
    expect(lines[0].accountCode).toBe(ACCOUNT.piutangUsaha);
  });

  it("posts a sale with COGS tracked (adds HPP / Persediaan Ternak lines)", () => {
    const lines = buildJournalLines({
      type: "sale",
      amount: 500_000,
      isCash: true,
      cogsAmount: 300_000,
    });
    expect(lines).toHaveLength(4);
    expect(lines).toContainEqual({ accountCode: ACCOUNT.hpp, debit: 300_000, credit: 0 });
    expect(lines).toContainEqual({
      accountCode: ACCOUNT.persediaanTernak,
      debit: 0,
      credit: 300_000,
    });
    expect(totalDebit(lines)).toBe(totalCredit(lines));
  });

  it("posts feed purchase on credit as Debit Persediaan Pakan / Kredit Utang Usaha", () => {
    const lines = buildJournalLines({ type: "purchase_feed", amount: 1_000_000, isCash: false });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.persediaanPakan, debit: 1_000_000, credit: 0 },
      { accountCode: ACCOUNT.utangUsaha, debit: 0, credit: 1_000_000 },
    ]);
  });

  it("posts an asset purchase as Debit Aset Tetap / Kredit Kas", () => {
    const lines = buildJournalLines({ type: "purchase_asset", amount: 280_800_000, isCash: true });
    expect(lines[0].accountCode).toBe(ACCOUNT.asetTetap);
    expect(lines[1].accountCode).toBe(ACCOUNT.kas);
  });

  it("posts an investor contribution as Debit Kas / Kredit Modal Investor", () => {
    const lines = buildJournalLines({ type: "investor_contribution", amount: 200_000_000 });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.kas, debit: 200_000_000, credit: 0 },
      { accountCode: ACCOUNT.modalInvestor, debit: 0, credit: 200_000_000 },
    ]);
  });

  it("posts a bank loan as Debit Kas / Kredit Utang Bank", () => {
    const lines = buildJournalLines({ type: "bank_loan", amount: 300_000_000 });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.kas, debit: 300_000_000, credit: 0 },
      { accountCode: ACCOUNT.utangBank, debit: 0, credit: 300_000_000 },
    ]);
  });

  it("splits loan repayment into principal (Utang Bank) and interest (Beban Bunga)", () => {
    const lines = buildJournalLines({
      type: "loan_repayment",
      principalAmount: 4_000_000,
      interestAmount: 500_000,
    });
    expect(lines).toContainEqual({ accountCode: ACCOUNT.utangBank, debit: 4_000_000, credit: 0 });
    expect(lines).toContainEqual({ accountCode: ACCOUNT.bebanBunga, debit: 500_000, credit: 0 });
    expect(lines).toContainEqual({ accountCode: ACCOUNT.kas, debit: 0, credit: 4_500_000 });
  });

  it("omits the principal line when a repayment is interest-only", () => {
    const lines = buildJournalLines({
      type: "loan_repayment",
      principalAmount: 0,
      interestAmount: 500_000,
    });
    expect(lines.some((l) => l.accountCode === ACCOUNT.utangBank)).toBe(false);
  });

  it("posts opex as Debit Beban Operasional / Kredit Kas", () => {
    const lines = buildJournalLines({ type: "opex", amount: 750_000, isCash: true });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.bebanOperasional, debit: 750_000, credit: 0 },
      { accountCode: ACCOUNT.kas, debit: 0, credit: 750_000 },
    ]);
  });

  it("posts depreciation as Debit Beban Penyusutan / Kredit Akumulasi Penyusutan", () => {
    const lines = buildJournalLines({ type: "depreciation", amount: 4_680_000 });
    expect(lines).toEqual([
      { accountCode: ACCOUNT.bebanPenyusutan, debit: 4_680_000, credit: 0 },
      { accountCode: ACCOUNT.akumulasiPenyusutan, debit: 0, credit: 4_680_000 },
    ]);
  });

  it("passes manual journal lines through unchanged", () => {
    const customLines = [
      { accountCode: ACCOUNT.kas, debit: 100, credit: 0 },
      { accountCode: ACCOUNT.bank, debit: 0, credit: 100 },
    ];
    expect(buildJournalLines({ type: "manual", lines: customLines })).toBe(customLines);
  });

  it("every non-manual rule produces balanced lines", () => {
    const cases = [
      { type: "sale", amount: 100, isCash: true } as const,
      { type: "purchase_livestock", amount: 100, isCash: false } as const,
      { type: "purchase_medicine", amount: 100, isCash: true } as const,
      { type: "purchase_service", amount: 100, isCash: false } as const,
      { type: "investor_contribution", amount: 100 } as const,
      { type: "bank_loan", amount: 100 } as const,
      { type: "loan_repayment", principalAmount: 60, interestAmount: 40 } as const,
      { type: "opex", amount: 100, isCash: false } as const,
      { type: "depreciation", amount: 100 } as const,
    ];

    for (const input of cases) {
      const lines = buildJournalLines(input);
      expect(totalDebit(lines)).toBe(totalCredit(lines));
    }
  });
});
