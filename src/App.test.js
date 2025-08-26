import { describe, it, expect } from "vitest";
// Try this first:
import { mergeExcel } from "./App";
// If that fails with a module resolution error, switch to:
// import { mergeExcel } from "./App.jsx";

describe("mergeExcel", () => {
  it("computes WinPct/Weighted and ranks correctly", () => {
    const out = mergeExcel(
      [
        { Player: "A", Wins: 10, Losses: 0 },
        { Player: "B", Wins: 5, Losses: 5 },
      ],
      [
        { Player: "A", Position: "G" },
        { Player: "B", Position: "F" },
      ]
    );
    expect(out).toHaveLength(2);
    const A = out.find((r) => r.Player === "A");
    const B = out.find((r) => r.Player === "B");
    expect(A.WinPct).toBe(1);
    expect(B.WinPct).toBe(0.5);
    expect(A.Weighted).toBeGreaterThan(B.Weighted);
    expect(A.Rank).toBe(1);
    expect(B.Rank).toBe(2);
  });

  it("supports W/L alias columns", () => {
    const out = mergeExcel([{ Name: "C", W: 7, L: 3 }], []);
    const C = out.find((r) => r.Player === "C");
    expect(C.Wins).toBe(7);
    expect(C.Losses).toBe(3);
  });

  it("handles empty inputs", () => {
    const out = mergeExcel([], []);
    expect(Array.isArray(out)).toBe(true);
    expect(out.length).toBe(0);
  });
});
