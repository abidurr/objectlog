"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { updateRecord } from "@/app/actions";
import type { getRecords } from "@/app/actions";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { RecordFieldInput } from "@/components/RecordFieldInput";
import type {
  RecordFieldDefinition,
  RecordFieldValue,
  RecordFieldType,
} from "@/components/RecordFieldInput";
import { StyledButton, StyledInput } from "@/components/StyledBits";

type RecordItem = Awaited<ReturnType<typeof getRecords>>["records"][number];
type SortColumn = "name" | `field:${string}`;

const VALUE_KEYS: Record<RecordFieldType, string> = {
  TEXT: "text_value",
  LONGTEXT: "longtext_value",
  DATE: "date_value",
  DATETIME: "datetime_value",
  SELECT: "select_value",
  MULTISELECT: "multiselect_value",
  ROUNDNUMBER: "roundnumber_value",
};

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

  th:has(button) {
    padding: 0;
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
    width: 100%;
    min-height: 42px;
    box-sizing: border-box;
    padding: 11px 14px;
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
`;

const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  padding: 16px 0;

  label {
    display: block;
    min-width: 0;
  }

  .actions,
  .feedback {
    grid-column: 1 / -1;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const getRecordFieldData = (record: RecordItem) => {
  if (
    !record.fields ||
    typeof record.fields !== "object" ||
    Array.isArray(record.fields)
  ) {
    return {};
  }
  return record.fields as Record<string, Record<string, unknown>>;
};

const getInitialValues = (
  record: RecordItem,
  fields: RecordFieldDefinition[],
) => {
  const recordFields = getRecordFieldData(record);
  return Object.fromEntries(
    fields
      .filter((field) => field.visible && field.canEdit)
      .map((field) => {
        const value = recordFields[field.id]?.[VALUE_KEYS[field.fieldType]];
        if (field.fieldType === "MULTISELECT") {
          return [
            field.id,
            Array.isArray(value)
              ? value.filter(
                  (option): option is string => typeof option === "string",
                )
              : [],
          ];
        }
        if (field.fieldType === "ROUNDNUMBER") {
          return [field.id, typeof value === "number" ? value : null];
        }
        return [field.id, typeof value === "string" ? value : ""];
      }),
  ) as Record<string, RecordFieldValue>;
};

const formatValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(", ") || "-";
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value) || "-";
  }
  return "-";
};

const RecordsTable = ({
  objectId,
  fields,
  records,
}: {
  objectId: string;
  fields: RecordFieldDefinition[];
  records: RecordItem[];
}) => {
  const router = useRouter();
  const visibleFields = fields.filter((field) => field.visible);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);
  const [name, setName] = useState("");
  const [values, setValues] = useState<Record<string, RecordFieldValue>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const startEditing = (record: RecordItem) => {
    setEditingRecord(record);
    setName(record.name);
    setValues(getInitialValues(record, fields));
    setError("");
    setMessage("");
  };

  const saveRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRecord || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");
    try {
      await updateRecord({
        objectId,
        recordId: editingRecord.id,
        name,
        values,
      });
      setEditingRecord(null);
      setMessage("Record updated.");
      router.refresh();
    } catch (caughtError) {
      console.error("Could not update record:", caughtError);
      setError(
        process.env.NODE_ENV === "development" && caughtError instanceof Error
          ? caughtError.message
          : "Could not update record. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditingRecord(null);
    setError("");
  };

  const getSortValue = (record: RecordItem, column: SortColumn) => {
    if (column === "name") {
      return record.name;
    }

    const fieldId = column.slice("field:".length);
    const field = visibleFields.find(
      (visibleField) => visibleField.id === fieldId,
    );
    const value = field
      ? getRecordFieldData(record)[field.id]?.[VALUE_KEYS[field.fieldType]]
      : undefined;
    return typeof value === "number" ? value : formatValue(value);
  };

  const sortedRecords = sortColumn
    ? [...records].sort((first, second) => {
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
      })
    : records;

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
    <>
      {message && <p role="status">{message}</p>}
      <TableWrap>
        <table>
          <thead>
            <tr>
              {renderHeader("name", "Name")}
              {visibleFields.map((field) =>
                renderHeader(`field:${field.id}`, field.name),
              )}
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={visibleFields.length + 2}>No records yet.</td>
              </tr>
            ) : (
              sortedRecords.map((record) => (
                <Fragment key={record.id}>
                  <tr>
                    <td>{record.name}</td>
                    {visibleFields.map((field) => (
                      <td key={field.id}>
                        {formatValue(
                          getRecordFieldData(record)[field.id]?.[
                            VALUE_KEYS[field.fieldType]
                          ],
                        )}
                      </td>
                    ))}
                    <td>
                      <StyledButton
                        type="button"
                        $btnclr="blue"
                        onClick={() => startEditing(record)}
                      >
                        Edit
                      </StyledButton>
                    </td>
                  </tr>
                  {editingRecord?.id === record.id && (
                    <tr>
                      <td colSpan={visibleFields.length + 2}>
                        <EditForm onSubmit={saveRecord}>
                          <label>
                            Record name
                            <StyledInput
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              required
                            />
                          </label>
                          {fields
                            .filter((field) => field.visible && field.canEdit)
                            .map((field) => (
                              <RecordFieldInput
                                key={field.id}
                                field={field}
                                value={values[field.id]}
                                onChange={(value) =>
                                  setValues((current) => ({
                                    ...current,
                                    [field.id]: value,
                                  }))
                                }
                              />
                            ))}
                          <div className="actions">
                            <StyledButton
                              type="submit"
                              $btnclr="green"
                              disabled={isSaving}
                            >
                              {isSaving ? "Saving..." : "Save changes"}
                            </StyledButton>
                            <StyledButton
                              type="button"
                              onClick={cancelEditing}
                              disabled={isSaving}
                            >
                              Cancel
                            </StyledButton>
                          </div>
                          {error && (
                            <p className="feedback" role="alert">
                              {error}
                            </p>
                          )}
                        </EditForm>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
};

export { RecordsTable };
