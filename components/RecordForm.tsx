"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createRecord, importRecordsFromCsv } from "@/app/actions";
import { RecordFieldInput } from "@/components/RecordFieldInput";
import type {
  RecordFieldDefinition,
  RecordFieldValue,
} from "@/components/RecordFieldInput";
import { ObjectBox, StyledButton, StyledInput } from "@/components/StyledBits";
import { parseCsv, stringifyCsv } from "@/lib/csv";
import { FiDownload, FiUpload } from "react-icons/fi";
import styled from "styled-components";

type RecordFormProps = {
  objectId: string;
  fields: RecordFieldDefinition[];
};

const ImportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  button {
    margin-bottom: 0;
  }
`;

const getInitialValues = (fields: RecordFieldDefinition[]) =>
  Object.fromEntries(
    fields.map((field) => [
      field.id,
      field.fieldType === "MULTISELECT"
        ? []
        : field.fieldType === "ROUNDNUMBER"
          ? null
          : "",
    ]),
  ) as Record<string, RecordFieldValue>;

const RecordForm = ({ objectId, fields }: RecordFormProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [values, setValues] = useState(() => getInitialValues(fields));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const importableFields = fields.filter(
    (field) => field.visible && field.canEdit,
  );

  const downloadCsv = (csv: string, filename: string) => {
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadSample = () => {
    const headers = [
      "Record name",
      ...importableFields.map((field) => field.name),
    ];
    const exampleValues = importableFields.map((field) => {
      switch (field.fieldType) {
        case "TEXT":
          return "Example text";
        case "LONGTEXT":
          return "Example long text";
        case "DATE":
          return "2026-01-15";
        case "DATETIME":
          return "2026-01-15T12:00";
        case "SELECT":
          return field.options[0] ?? "";
        case "MULTISELECT":
          return field.options.slice(0, 2).join(";");
        case "ROUNDNUMBER":
          return "1";
      }
    });
    downloadCsv(
      stringifyCsv([headers, ["Example record", ...exampleValues]]),
      "record-sample.csv",
    );
  };

  const importCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || isImporting) {
      return;
    }

    setIsImporting(true);
    setMessage("");
    setError("");
    try {
      if (file.size > 400_000) {
        throw new Error("CSV files must be smaller than 400 KB.");
      }
      const { headers, rows } = parseCsv(await file.text());
      const result = await importRecordsFromCsv({ objectId, headers, rows });
      if (!result.ok) {
        downloadCsv(result.csv, "record-import-results.csv");
        setError(result.message);
        return;
      }
      setMessage(
        `${result.importedCount} record${result.importedCount === 1 ? "" : "s"} imported.`,
      );
      router.refresh();
    } catch (caughtError) {
      console.error("Could not import records:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not import records. Please try again.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const updateValue = (fieldId: string, value: RecordFieldValue) => {
    setValues((currentValues) => ({ ...currentValues, [fieldId]: value }));
  };

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await createRecord({ objectId, name, values });
      setName("");
      setValues(getInitialValues(fields));
      setMessage("Record created.");
      router.refresh();
    } catch (caughtError) {
      console.error("Could not create record:", caughtError);
      setError(
        process.env.NODE_ENV === "development" && caughtError instanceof Error
          ? caughtError.message
          : "Could not create record. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ObjectBox>
      <h3>Add record</h3>
      <form onSubmit={saveRecord}>
        <label>
          Record name
          <StyledInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
        {fields
          .filter((field) => field.visible)
          .map((field) => (
            <RecordFieldInput
              key={field.id}
              field={field}
              value={values[field.id]}
              onChange={(value) => updateValue(field.id, value)}
            />
          ))}
        <StyledButton type="submit" $btnclr="green" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save record"}
        </StyledButton>
      </form>
      <ImportActions aria-label="Import records">
        <StyledButton type="button" onClick={downloadSample}>
          <FiDownload aria-hidden="true" />
          Download sample CSV
        </StyledButton>
        <StyledButton
          type="button"
          $btnclr="green"
          disabled={isImporting}
          onClick={() => fileInput.current?.click()}
        >
          <FiUpload aria-hidden="true" />
          {isImporting ? "Validating CSV..." : "Upload CSV"}
        </StyledButton>
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          onChange={importCsv}
          hidden
        />
      </ImportActions>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </ObjectBox>
  );
};

export { RecordForm };
