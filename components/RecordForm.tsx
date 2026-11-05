"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createRecord } from "@/app/actions";
import { RecordFieldInput } from "@/components/RecordFieldInput";
import type {
  RecordFieldDefinition,
  RecordFieldValue,
} from "@/components/RecordFieldInput";
import { ObjectBox, StyledButton, StyledInput } from "@/components/StyledBits";

type RecordFormProps = {
  objectId: string;
  fields: RecordFieldDefinition[];
};

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
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </form>
    </ObjectBox>
  );
};

export { RecordForm };
