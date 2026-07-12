import { describe, expect, it } from "vitest";

import { assertBalanced, buildReversalLines, UnbalancedJournalError } from "./ledger-service";
import { buildJournalLines } from "./posting-rules";

describe("assertBalanced", () => {
  it("accepts balanced lines", () => {
    expect(() =>
      assertBalanced([
        { accountCode: "1100", debit: 100, credit: 0 },
        { accountCode: "4100", debit: 0, credit: 100 },
      ]),
    ).not.toThrow();
  });

  it("rejects unbalanced lines", () => {
    expect(() =>
      assertBalanced([
        { accountCode: "1100", debit: 100, credit: 0 },
        { accountCode: "4100", debit: 0, credit: 90 },
      ]),
    ).toThrow(UnbalancedJournalError);
  });

  it("tolerates floating point noise below a cent", () => {
    expect(() =>
      assertBalanced([
        { accountCode: "1100", debit: 0.1 + 0.2, credit: 0 },
        { accountCode: "4100", debit: 0, credit: 0.3 },
      ]),
    ).not.toThrow();
  });
});

describe("buildReversalLines", () => {
  it("swaps debit and credit on every line", () => {
    const original = buildJournalLines({ type: "sale", amount: 500_000, isCash: true });
    const reversal = buildReversalLines(original);

    expect(reversal).toEqual([
      { accountCode: original[0].accountCode, debit: 0, credit: 500_000 },
      { accountCode: original[1].accountCode, debit: 500_000, credit: 0 },
    ]);
  });

  it("produces a balanced entry when the original was balanced", () => {
    const original = buildJournalLines({
      type: "loan_repayment",
      principalAmount: 4_000_000,
      interestAmount: 500_000,
    });
    const reversal = buildReversalLines(original);
    expect(() => assertBalanced(reversal)).not.toThrow();
  });

  it("returns the ledger to its original state when applied twice", () => {
    const original = buildJournalLines({ type: "bank_loan", amount: 300_000_000 });
    const reversed = buildReversalLines(original);
    const reReversed = buildReversalLines(reversed);
    expect(reReversed).toEqual(original);
  });
});
