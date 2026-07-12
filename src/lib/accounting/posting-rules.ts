import type { JournalLineInput, PostingInput } from "./types";

const ACCOUNT = {
  kas: "1100",
  bank: "1200",
  piutangUsaha: "1300",
  persediaanTernak: "1400",
  persediaanPakan: "1410",
  asetTetap: "1500",
  akumulasiPenyusutan: "1510",
  utangUsaha: "2100",
  utangBank: "2200",
  modalPemilik: "3100",
  modalInvestor: "3200",
  pendapatanPenjualan: "4100",
  hpp: "5100",
  bebanPakan: "5200",
  bebanOperasional: "5300",
  bebanBunga: "5400",
  bebanPenyusutan: "5500",
} as const;

function debit(accountCode: string, amount: number): JournalLineInput {
  return { accountCode, debit: amount, credit: 0 };
}

function credit(accountCode: string, amount: number): JournalLineInput {
  return { accountCode, debit: 0, credit: amount };
}

const PURCHASE_DEBIT_ACCOUNT: Record<
  Extract<
    PostingInput["type"],
    | "purchase_feed"
    | "purchase_livestock"
    | "purchase_medicine"
    | "purchase_asset"
    | "purchase_service"
  >,
  string
> = {
  purchase_feed: ACCOUNT.persediaanPakan,
  purchase_livestock: ACCOUNT.persediaanTernak,
  purchase_medicine: ACCOUNT.bebanOperasional,
  purchase_asset: ACCOUNT.asetTetap,
  purchase_service: ACCOUNT.bebanOperasional,
};

/**
 * Maps a business-level transaction to its double-entry journal lines.
 * Pure function — no I/O — so every rule is unit-testable in isolation.
 */
export function buildJournalLines(input: PostingInput): JournalLineInput[] {
  switch (input.type) {
    case "sale": {
      const cashOrReceivable = input.isCash ? ACCOUNT.kas : ACCOUNT.piutangUsaha;
      const lines = [
        debit(cashOrReceivable, input.amount),
        credit(ACCOUNT.pendapatanPenjualan, input.amount),
      ];
      if (input.cogsAmount && input.cogsAmount > 0) {
        lines.push(
          debit(ACCOUNT.hpp, input.cogsAmount),
          credit(ACCOUNT.persediaanTernak, input.cogsAmount),
        );
      }
      return lines;
    }

    case "purchase_feed":
    case "purchase_livestock":
    case "purchase_medicine":
    case "purchase_asset":
    case "purchase_service": {
      const debitAccount = PURCHASE_DEBIT_ACCOUNT[input.type];
      const creditAccount = input.isCash ? ACCOUNT.kas : ACCOUNT.utangUsaha;
      return [debit(debitAccount, input.amount), credit(creditAccount, input.amount)];
    }

    case "investor_contribution":
      return [debit(ACCOUNT.kas, input.amount), credit(ACCOUNT.modalInvestor, input.amount)];

    case "bank_loan":
      return [debit(ACCOUNT.kas, input.amount), credit(ACCOUNT.utangBank, input.amount)];

    case "loan_repayment": {
      const total = input.principalAmount + input.interestAmount;
      const lines: JournalLineInput[] = [];
      if (input.principalAmount > 0) {
        lines.push(debit(ACCOUNT.utangBank, input.principalAmount));
      }
      if (input.interestAmount > 0) {
        lines.push(debit(ACCOUNT.bebanBunga, input.interestAmount));
      }
      lines.push(credit(ACCOUNT.kas, total));
      return lines;
    }

    case "opex": {
      const creditAccount = input.isCash ? ACCOUNT.kas : ACCOUNT.utangUsaha;
      return [debit(ACCOUNT.bebanOperasional, input.amount), credit(creditAccount, input.amount)];
    }

    case "depreciation":
      return [
        debit(ACCOUNT.bebanPenyusutan, input.amount),
        credit(ACCOUNT.akumulasiPenyusutan, input.amount),
      ];

    case "manual":
      return input.lines;
  }
}

export { ACCOUNT as CHART_OF_ACCOUNTS_CODES };
