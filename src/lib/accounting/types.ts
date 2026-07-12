import type { Enums } from "@/types/supabase";

export type TransactionType = Enums<"transaction_type">;

export type JournalLineInput = {
  accountCode: string;
  debit: number;
  credit: number;
};

export type JournalEntryInput = {
  entryDate: string;
  memo: string;
  sourceType: string;
  sourceId?: string;
  lines: JournalLineInput[];
};

export type SaleTransactionInput = {
  type: "sale";
  amount: number;
  isCash: boolean;
  cogsAmount?: number;
};

export type PurchaseTransactionInput = {
  type:
    | "purchase_feed"
    | "purchase_livestock"
    | "purchase_medicine"
    | "purchase_asset"
    | "purchase_service";
  amount: number;
  isCash: boolean;
};

export type InvestorContributionInput = {
  type: "investor_contribution";
  amount: number;
};

export type BankLoanInput = {
  type: "bank_loan";
  amount: number;
};

export type LoanRepaymentInput = {
  type: "loan_repayment";
  principalAmount: number;
  interestAmount: number;
};

export type OpexInput = {
  type: "opex";
  amount: number;
  isCash: boolean;
};

export type DepreciationInput = {
  type: "depreciation";
  amount: number;
};

export type ManualJournalInput = {
  type: "manual";
  lines: JournalLineInput[];
};

export type PostingInput =
  | SaleTransactionInput
  | PurchaseTransactionInput
  | InvestorContributionInput
  | BankLoanInput
  | LoanRepaymentInput
  | OpexInput
  | DepreciationInput
  | ManualJournalInput;
