"use client";

import { useState } from "react";
import styled from "styled-components";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import type { getObjectsWithRecentRecords } from "@/app/actions";

type ObjectData = Awaited<
  ReturnType<typeof getObjectsWithRecentRecords>
>[number];
type RecordItem = ObjectData["records"][number];
type FieldItem = ObjectData["fields"][number];
type SortColumn = "name" | "createdAt" | `field:${string}`;

const TableWrap = styled.div`
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid #d8ded8;
  border-radius: 6px;
  background: #fff;

  table {
    width: 100%;
    min-width: 560px;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
  }

  th,
  td {
    padding: 11px 14px;
    border-bottom: 1px solid #e6eae6;
    vertical-align: top;
    color: #152a22;
  }

  th {
    background: #f3f6f2;
    color: #3d4b40;
    font-size: 0.82rem;
    font-weight: 650;
    white-space: nowrap;
  }

  th:first-child {
    border-top-left-radius: 5px;
  }

  th:last-child {
    border-top-right-radius: 5px;
  }

  th button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  th button:hover {
    color: #17653f;
  }

  th button:focus-visible {
    outline: 2px solid #17653f;
    outline-offset: 3px;
  }

  th button svg {
    flex: none;
    color: #657369;
  }

  tbody tr:nth-child(even) {
    background: #fafbf9;
  }

  tbody tr:hover {
    background: #eff5ef;
  }

  tbody tr:last-child > * {
    border-bottom: 0;
  }

  tbody th[scope="row"] {
    color: #202a22;
    font-weight: 600;
    text-align: left;
  }
`;

function getComputedValue(recordFields: RecordItem["fields"], fieldId: string) {
  if (
    recordFields === null ||
    Array.isArray(recordFields) ||
    typeof recordFields !== "object"
  ) {
    return "-";
  }

  const fieldValue = recordFields[fieldId];
  if (
    fieldValue === null ||
    Array.isArray(fieldValue) ||
    typeof fieldValue !== "object"
  ) {
    return "-";
  }

  const value = fieldValue.computed_value;
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

const RecentRecordsTable = ({
  fields,
  records,
}: {
  fields: FieldItem[];
  records: RecordItem[];
}) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getSortValue = (record: RecordItem, column: SortColumn) => {
    if (column === "name") {
      return record.name;
    }
    if (column === "createdAt") {
      return record.createdAt?.getTime() ?? 0;
    }
    return getComputedValue(record.fields, column.slice("field:".length));
  };

  const sortedRecords = [...records].sort((first, second) => {
    const firstValue = getSortValue(first, sortColumn);
    const secondValue = getSortValue(second, sortColumn);
    const comparison =
      typeof firstValue === "number" && typeof secondValue === "number"
        ? firstValue - secondValue
        : String(firstValue).localeCompare(String(secondValue), undefined, {
            numeric: true,
            sensitivity: "base",
          });
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const renderHeader = (column: SortColumn, label: string) => {
    const isActive = sortColumn === column;
    const nextDirection = isActive && sortDirection === "asc" ? "desc" : "asc";
    const SortIcon =
      isActive && sortDirection === "asc" ? FiArrowUp : FiArrowDown;

    return (
      <th
        key={column}
        scope="col"
        aria-sort={
          isActive
            ? sortDirection === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        <button
          type="button"
          onClick={() => {
            if (isActive) {
              setSortDirection(nextDirection);
            } else {
              setSortColumn(column);
              setSortDirection("asc");
            }
          }}
          aria-label={`Sort by ${label} ${nextDirection === "asc" ? "ascending" : "descending"}`}
        >
          {label}
          <SortIcon aria-hidden="true" size={14} />
        </button>
      </th>
    );
  };

  return (
    <TableWrap>
      <table>
        <thead>
          <tr>
            {renderHeader("name", "Record")}
            {fields.map((field) =>
              renderHeader(`field:${field.id}`, field.name),
            )}
            {renderHeader("createdAt", "Created")}
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record) => (
            <tr key={record.id}>
              <th scope="row">{record.name}</th>
              {fields.map((field) => (
                <td key={field.id}>
                  {getComputedValue(record.fields, field.id)}
                </td>
              ))}
              <td>{record.createdAt?.toLocaleString() ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
};

export { RecentRecordsTable };
