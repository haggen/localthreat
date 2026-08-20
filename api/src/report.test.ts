import { deepEqual } from "node:assert/strict";
import test, { describe } from "node:test";
import { Report } from "./report.ts";

describe("Report", () => {
  test("chat transcript", () => {
    const sample = `[14:34:02] Username > <url=showinfo:1300//0000000000>Player 1</url>  <url=showinfo:1300//0000000000>Player 2</url>  <url=showinfo:5//30005208>Ziasad</url>`;
    const report = Report.parse(sample);

    deepEqual(report, ["Player 1", "Player 2"]);
  });

  test("name list with invalid length", () => {
    const report = Report.parse("Alpha\nBo\nGamma");
    deepEqual(report, []);
  });

  test("valid name list", () => {
    const report = Report.parse("Alpha\nBeta\nGamma");
    deepEqual(report, ["Alpha", "Beta", "Gamma"]);
  });
});
