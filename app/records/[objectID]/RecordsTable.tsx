"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { updateRecord } from "@/app/actions";
import type { getRecords } from "@/app/actions";
import { RecordFieldInput } from "@/components/RecordFieldInput";
import type {
  RecordFieldDefinition,
  RecordFieldValue,
  RecordFieldType,
} from "@/components/RecordFieldInput";
import { StyledButton, StyledInput } from "@/components/StyledBits";

type RecordItem = Awaited<ReturnType<typeof getRecords>>["records"][number];

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

  table {
    width: 100%;
    min-width: 520px;
    border-collapse: collapse;
    text-align: left;
  }

  th,
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #ccc;
    vertical-align: top;
  }

  th {
    white-space: nowrap;
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

  return (
    <>
      {message && <p role="status">{message}</p>}
      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              {visibleFields.map((field) => (
                <th key={field.id}>{field.name}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={visibleFields.length + 2}>No records yet.</td>
              </tr>
            ) : (
              records.map((record) => (
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
