export type ParsedCsv = {
  headers: string[];
  rows: string[][];
};

export function parseCsv(input: string): ParsedCsv {
  const text = input.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;
  let quoteClosed = false;

  const finishRow = () => {
    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) {
      rows.push(row);
    }
    row = [];
    value = "";
    quoteClosed = false;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
        quoteClosed = true;
      } else {
        value += character;
      }
      continue;
    }

    if (quoteClosed) {
      if (character === ",") {
        row.push(value);
        value = "";
        quoteClosed = false;
      } else if (character === "\n" || character === "\r") {
        finishRow();
        if (character === "\r" && text[index + 1] === "\n") {
          index += 1;
        }
      } else if (character !== " " && character !== "\t") {
        throw new Error("The CSV contains a quote in an invalid position.");
      }
      continue;
    }

    if (character === '"') {
      if (value.length > 0) {
        throw new Error("The CSV contains a quote in an invalid position.");
      }
      inQuotes = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n" || character === "\r") {
      finishRow();
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
    } else {
      value += character;
    }
  }

  if (inQuotes) {
    throw new Error("The CSV has an unclosed quoted value.");
  }
  if (row.length > 0 || value.length > 0 || quoteClosed) {
    finishRow();
  }
  if (rows.length === 0 || rows[0].length === 0) {
    throw new Error("The CSV must include a header row.");
  }

  return {
    headers: rows[0].map((header) => header.trim()),
    rows: rows.slice(1),
  };
}

export function stringifyCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const safeCell = /^[\s]*[=+@-]/.test(cell) ? `'${cell}` : cell;
          return `"${safeCell.replace(/"/g, '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
}
