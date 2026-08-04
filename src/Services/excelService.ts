import * as XLSX from "xlsx";

export interface ExcelData {
  sheetNames: string[];
  sheets: Record<string, any[]>;
}

export async function readExcel(file: File): Promise<ExcelData> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheets: Record<string, any[]> = {};

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];

    sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });
  });

  return {
    sheetNames: workbook.SheetNames,
    sheets,
  };
}