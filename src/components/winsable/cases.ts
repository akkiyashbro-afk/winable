import { createServerFn } from "@tanstack/react-start";
import { getAllCases, generateCasesExcel } from "@/lib/excel";

export const getCasesFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      const cases = await getAllCases();
      return { ok: true, cases: JSON.parse(JSON.stringify(cases)), error: "" };
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      return { ok: false, cases: [], error: "Failed to fetch cases from database" };
    }
  },
);

export const downloadExcelFn = createServerFn({ method: "GET" as const }).handler(
  async () => {
    try {
      const buffer = await generateCasesExcel();
      return {
        ok: true,
        data: buffer.toString("base64"),
        error: "",
      };
    } catch (err) {
      console.error("Failed to generate Excel:", err);
      return { ok: false, data: "", error: "Failed to generate Excel file" };
    }
  },
);
