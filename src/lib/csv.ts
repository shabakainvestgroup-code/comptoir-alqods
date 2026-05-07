function escapeCsvValue(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsv(rows: unknown[][]) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(";")).join("\n")}`;
}

export function csvResponse(filename: string, rows: unknown[][]) {
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
