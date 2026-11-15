"use client";

import { useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import type { getObjectsWithRecentRecords } from "@/app/actions";
import {
  ObjectTable,
  ObjectTableContainer,
} from "@/components/StyledBits";

type ObjectData = Awaited<
  ReturnType<typeof getObjectsWithRecentRecords>
>[number];
type RecordItem = ObjectData["records"][number];
type FieldItem = ObjectData["fields"][number];
type SortColumn = "name" | "createdAt" | `field:${string}`;

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

  const renderHeader = (
    column: SortColumn,
    label: string,
    isNumeric = false,
  ) => {
    const isActive = sortColumn === column;
    const nextDirection = isActive && sortDirection === "asc" ? "desc" : "asc";
    const SortIcon =
      isActive && sortDirection === "asc" ? FiArrowUp : FiArrowDown;

    return (
      <th
        key={column}
        className={isNumeric ? "numeric-column" : undefined}
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
    <ObjectTableContainer>
      <ObjectTable>
        <thead>
          <tr>
            {renderHeader("name", "Record")}
            {fields.map((field) =>
              renderHeader(
                `field:${field.id}`,
                field.name,
                field.fieldType === "ROUNDNUMBER",
              ),
            )}
            {renderHeader("createdAt", "Created")}
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map((record, index) => (
            <tr
              key={record.id}
              className={
                index === sortedRecords.length - 1
                  ? "last-record-row"
                  : undefined
              }
            >
              <th scope="row" className="record-name-cell">
                {record.name}
              </th>
              {fields.map((field) => (
                <td
                  key={field.id}
                  className={
                    field.fieldType === "ROUNDNUMBER"
                      ? "numeric-column"
                      : undefined
                  }
                >
                  {getComputedValue(record.fields, field.id)}
                </td>
              ))}
              <td>{record.createdAt?.toLocaleString() ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </ObjectTable>
    </ObjectTableContainer>
  );
};

export { RecentRecordsTable };
