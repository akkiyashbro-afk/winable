import ExcelJS from "exceljs";
import { getMongooseConnection } from "./mongodb";
import { CaseModel, type ICase } from "./models/Case";

export async function generateCasesExcel(): Promise<Buffer> {
  await getMongooseConnection();
  const cases = await CaseModel.find({}).sort({ submittedAt: -1 }).lean();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "WinsAble";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Cases", {
    properties: { tabColor: { argb: "FFD4A843" } },
  });

  sheet.columns = [
    { header: "Case ID", key: "caseId", width: 22 },
    { header: "Name", key: "fullName", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Platform", key: "platform", width: 18 },
    { header: "Username/Handle", key: "username", width: 22 },
    { header: "Followers", key: "followers", width: 14 },
    { header: "Case Type", key: "caseType", width: 28 },
    { header: "Case Description", key: "description", width: 50 },
    { header: "Original URL", key: "originalUrl", width: 30 },
    { header: "Additional Details", key: "additionalDetails", width: 30 },
    { header: "Submitted At", key: "submittedAt", width: 22 },
    { header: "Status", key: "status", width: 14 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FF000000" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD4A843" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  for (const c of cases) {
    const row = c as ICase;
    sheet.addRow({
      caseId: row.caseId,
      fullName: row.fullName,
      email: row.email,
      phone: "",
      platform: row.platform,
      username: row.username || "",
      followers: row.followers || "",
      caseType: row.caseType,
      description: row.description,
      originalUrl: "",
      additionalDetails: [
        row.alreadySubmittedAppeal ? `Appeal submitted: ${row.alreadySubmittedAppeal}` : "",
        row.canStillLogin ? `Can still login: ${row.canStillLogin}` : "",
      ]
        .filter(Boolean)
        .join("; "),
      submittedAt: row.submittedAt
        ? new Date(row.submittedAt).toLocaleString("en-US", { timeZone: "UTC" })
        : "",
      status: row.status,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function getAllCases(): Promise<ICase[]> {
  await getMongooseConnection();
  return CaseModel.find({}).sort({ submittedAt: -1 }).lean();
}
