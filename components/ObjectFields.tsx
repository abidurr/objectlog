"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { updateObjectFields } from "@/app/actions";
import { theme } from "@/components/theme";
import {
  ObjectBox,
  StyledButton,
  StyledInput,
  StyledSelect,
  ObjectsGrid,
} from "@/components/StyledBits";

const Tabs = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 16px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: 0;
  border-bottom: 3px solid
    ${(props) => (props.$active ? "currentColor" : "transparent")};
  background: transparent;
  color: inherit;
  padding: 8px 12px;
  font: inherit;
  cursor: pointer;
  font-weight: bold;
  color: ${theme.DARK_COLOR_TEXT};
`;

const TableWrap = styled.div`
  max-width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
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
  const [activeTab, setActiveTab] = useState<"data" | "edit">("data");
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
      <Tabs role="tablist" aria-label="Object fields">
        <TabButton
          id="field-data-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "data"}
          aria-controls="field-data-panel"
          $active={activeTab === "data"}
          onClick={() => setActiveTab("data")}
        >
          View
        </TabButton>
        <TabButton
          id="field-editor-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "edit"}
          aria-controls="field-editor-panel"
          $active={activeTab === "edit"}
          onClick={() => setActiveTab("edit")}
        >
          Edit
        </TabButton>
      </Tabs>
      {activeTab === "data" ? (
        <div
          id="field-data-panel"
          role="tabpanel"
          aria-labelledby="field-data-tab"
        >
          {fields.length === 0 ? (
            <p>No fields yet.</p>
          ) : (
            <TableWrap>
              <table>
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Name</th>
                    <th>Type</th>
                    <th>Options</th>
                    {/* <th>Object ID</th> */}
                    <th>Editable</th>
                    <th>Visible</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id ?? `new-field-${index}`}>
                      {/* <td>{field.id ?? "Unsaved"}</td> */}
                      <td>{field.id ? field.name : "Unsaved changes"}</td>
                      <td>{field.fieldType}</td>
                      <td>{field.options.join(", ") || "-"}</td>
                      {/* <td>{objectId}</td> */}
                      <td>{field.canEdit ? "Yes" : "No"}</td>
                      <td>{field.visible ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </div>
      ) : (
        <div
          id="field-editor-panel"
          role="tabpanel"
          aria-labelledby="field-editor-tab"
        >
          <form onSubmit={saveFields}>
            {fields.length === 0 && <p>No fields yet.</p>}
            <ObjectsGrid>
              {fields.map((field, index) => (
                <fieldset
                  style={{ maxWidth: "260px" }}
                  key={field.id ?? `new-field-${index}`}
                >
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
                  {["MULTISELECT", "SELECT"].includes(field?.fieldType) && (
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
                  )}
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
                    style={{ marginTop: "24px" }}
                    type="button"
                    $btnclr="red"
                    onClick={() => removeField(index)}
                    disabled={isSaving}
                  >
                    Delete field
                  </StyledButton>
                </fieldset>
              ))}
            </ObjectsGrid>
            <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
              <StyledButton
                type="button"
                onClick={addField}
                disabled={isSaving}
              >
                Add new field
              </StyledButton>
              <StyledButton type="submit" $btnclr="green" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save all fields"}
              </StyledButton>
            </div>
            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}
          </form>
        </div>
      )}
    </ObjectBox>
  );
};

export { ObjectFields };
