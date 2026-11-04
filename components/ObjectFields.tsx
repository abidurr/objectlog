"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { updateObjectFields } from "@/app/actions";
import {
  ObjectBox,
  StyledButton,
  StyledInput,
  StyledSelect,
} from "@/components/StyledBits";

type FieldType =
  | "TEXT"
  | "LONGTEXT"
  | "DATE"
  | "DATETIME"
  | "SELECT"
  | "MULTISELECT"
  | "ROUNDNUMBER";

type ObjectField = {
  id?: string;
  name: string;
  fieldType: FieldType;
  options: string[];
  canEdit: boolean;
  visible: boolean;
};

const FIELD_TYPES: FieldType[] = [
  "TEXT",
  "LONGTEXT",
  "DATE",
  "DATETIME",
  "SELECT",
  "MULTISELECT",
  "ROUNDNUMBER",
];

type ObjectFieldsProps = {
  objectId: string;
  fields: ObjectField[];
};

const ObjectFields = ({
  objectId,
  fields: initialFields,
}: ObjectFieldsProps) => {
  const router = useRouter();
  const [fields, setFields] = useState(initialFields);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (index: number, updates: Partial<ObjectField>) => {
    setFields((currentFields) =>
      currentFields.map((field, fieldIndex) =>
        fieldIndex === index ? { ...field, ...updates } : field,
      ),
    );
  };

  const addField = () => {
    setFields((currentFields) => [
      ...currentFields,
      {
        name: "",
        fieldType: "TEXT",
        options: [],
        canEdit: true,
        visible: true,
      },
    ]);
    setMessage("");
    setError("");
  };

  const removeField = (index: number) => {
    setFields((currentFields) =>
      currentFields.filter((_, fieldIndex) => fieldIndex !== index),
    );
  };

  const saveFields = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    const normalizedFields = fields.map((field) => ({
      ...field,
      name: field.name.trim(),
      options: field.options.map((option) => option.trim()).filter(Boolean),
    }));

    if (normalizedFields.some((field) => !field.name)) {
      setError("Every field needs a name.");
      setMessage("");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedObject = await updateObjectFields({
        objectId,
        fields: normalizedFields,
      });
      setFields(updatedObject.fields);
      setMessage("Fields updated.");
      router.refresh();
    } catch (caughtError) {
      console.error("Could not update fields:", caughtError);
      setError(
        process.env.NODE_ENV === "development" && caughtError instanceof Error
          ? caughtError.message
          : "Could not update fields. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ObjectBox>
      <h3>Fields</h3>
      <form onSubmit={saveFields}>
        {fields.length === 0 && <p>No fields yet.</p>}
        {fields.map((field, index) => (
          <fieldset key={field.id ?? `new-field-${index}`}>
            <legend>Field {index + 1}</legend>
            <label>
              Name
              <StyledInput
                value={field.name}
                onChange={(event) =>
                  updateField(index, { name: event.target.value })
                }
                required
              />
            </label>
            <label>
              Type
              <StyledSelect
                value={field.fieldType}
                onChange={(event) =>
                  updateField(index, {
                    fieldType: event.target.value as FieldType,
                  })
                }
              >
                {FIELD_TYPES.map((fieldType) => (
                  <option key={fieldType} value={fieldType}>
                    {fieldType}
                  </option>
                ))}
              </StyledSelect>
            </label>
            <label>
              Options (comma separated)
              <StyledInput
                value={field.options.join(", ")}
                onChange={(event) =>
                  updateField(index, {
                    options: event.target.value.split(","),
                  })
                }
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.canEdit}
                onChange={(event) =>
                  updateField(index, { canEdit: event.target.checked })
                }
              />
              Editable
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.visible}
                onChange={(event) =>
                  updateField(index, { visible: event.target.checked })
                }
              />
              Visible
            </label>
            <StyledButton
              type="button"
              $btnclr="red"
              onClick={() => removeField(index)}
              disabled={isSaving}
            >
              Remove field
            </StyledButton>
          </fieldset>
        ))}
        <StyledButton type="button" onClick={addField} disabled={isSaving}>
          Add field
        </StyledButton>
        <StyledButton type="submit" $btnclr="green" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save fields"}
        </StyledButton>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </form>
    </ObjectBox>
  );
};

export { ObjectFields };
