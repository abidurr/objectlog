"use client";

import styled from "styled-components";
import { StyledInput, StyledSelect } from "@/components/StyledBits";

export type RecordFieldType =
  | "TEXT"
  | "LONGTEXT"
  | "DATE"
  | "DATETIME"
  | "SELECT"
  | "MULTISELECT"
  | "ROUNDNUMBER";

export type RecordFieldDefinition = {
  id: string;
  name: string;
  fieldType: RecordFieldType;
  options: string[];
  canEdit: boolean;
  visible: boolean;
};

export type RecordFieldValue = string | string[] | number | null;

type FieldInputProps = {
  field: RecordFieldDefinition;
  value: RecordFieldValue;
  onChange: (value: RecordFieldValue) => void;
};

const FieldLabel = styled.label`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
`;

const LongTextInput = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: 120px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  resize: vertical;
`;

const MultiSelectGroup = styled.fieldset`
  display: grid;
  gap: 8px;
  margin: 0 0 16px;
  padding: 12px;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TextFieldInput = ({ field, value, onChange }: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <StyledInput
      type="text"
      value={typeof value === "string" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) => onChange(event.target.value)}
    />
  </FieldLabel>
);

export const LongTextFieldInput = ({
  field,
  value,
  onChange,
}: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <LongTextInput
      value={typeof value === "string" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) => onChange(event.target.value)}
    />
  </FieldLabel>
);

export const DateFieldInput = ({ field, value, onChange }: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <StyledInput
      type="date"
      value={typeof value === "string" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) => onChange(event.target.value)}
    />
  </FieldLabel>
);

export const DateTimeFieldInput = ({
  field,
  value,
  onChange,
}: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <StyledInput
      type="datetime-local"
      value={typeof value === "string" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) => onChange(event.target.value)}
    />
  </FieldLabel>
);

export const SelectFieldInput = ({
  field,
  value,
  onChange,
}: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <StyledSelect
      value={typeof value === "string" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">Select an option</option>
      {field.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </StyledSelect>
  </FieldLabel>
);

export const MultiSelectFieldInput = ({
  field,
  value,
  onChange,
}: FieldInputProps) => {
  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <MultiSelectGroup disabled={!field.canEdit}>
      <legend>{field.name}</legend>
      {field.options.length === 0 ? (
        <span>No options configured.</span>
      ) : (
        field.options.map((option) => (
          <OptionLabel key={option}>
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              disabled={!field.canEdit}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...selectedValues, option]
                    : selectedValues.filter((selected) => selected !== option),
                )
              }
            />
            {option}
          </OptionLabel>
        ))
      )}
    </MultiSelectGroup>
  );
};

export const RoundNumberFieldInput = ({
  field,
  value,
  onChange,
}: FieldInputProps) => (
  <FieldLabel>
    {field.name}
    <StyledInput
      type="number"
      step="any"
      value={typeof value === "number" ? value : ""}
      disabled={!field.canEdit}
      onChange={(event) =>
        onChange(event.target.value === "" ? null : Number(event.target.value))
      }
    />
  </FieldLabel>
);

export const RecordFieldInput = (props: FieldInputProps) => {
  switch (props.field.fieldType) {
    case "TEXT":
      return <TextFieldInput {...props} />;
    case "LONGTEXT":
      return <LongTextFieldInput {...props} />;
    case "DATE":
      return <DateFieldInput {...props} />;
    case "DATETIME":
      return <DateTimeFieldInput {...props} />;
    case "SELECT":
      return <SelectFieldInput {...props} />;
    case "MULTISELECT":
      return <MultiSelectFieldInput {...props} />;
    case "ROUNDNUMBER":
      return <RoundNumberFieldInput {...props} />;
  }
};
