"use client";

import { useState } from "react";
import { createObject } from "@/app/actions";
import {
  StyledButton,
  StyledInput,
  FieldInfo,
  FieldLabelSpan,
  StyledSelect,
  ObjectBox,
} from "@/components/StyledBits";
import { COLOR_OPTIONS, getBackgroundForColor } from "@/components/theme";
import { FiEye } from "react-icons/fi";
import { IoBrushOutline } from "react-icons/io5";

const CreateObject = () => {
  const [objectName, setObjectName] = useState("");
  const [objectColor, setObjectColor] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const colorOptions: readonly string[] = COLOR_OPTIONS;

  const createNewObject = async () => {
    const name = objectName.trim();
    const color = objectColor?.toLowerCase().trim();
    if (!name || isCreating) {
      return;
    }

    setIsCreating(true);
    setError("");
    try {
      await createObject({ input: { name, fields: [], color: color } });
      setObjectName("");
    } catch {
      setError("Could not create object. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <>
      &nbsp;
      <h1>Actions</h1>
      <ObjectBox>
        <h3>Create New Object</h3>
        <FieldInfo>
          <FiEye />
          <FieldLabelSpan>Name</FieldLabelSpan>
        </FieldInfo>
        <StyledInput
          style={{ width: "250px", margin: "4px 0px 16px 0px" }}
          placeholder="Object name, e.g. 'Book', 'Friend' etc."
          value={objectName}
          onChange={(e) => setObjectName(e.target.value)}
        />
        <FieldInfo>
          <IoBrushOutline />
          <FieldLabelSpan>Color</FieldLabelSpan>
          {/* {object?.color ?? "Not available"} */}
        </FieldInfo>
        <StyledSelect
          style={{
            margin: "4px 0px 16px 0px",
            backgroundColor: getBackgroundForColor(objectColor),
          }}
          value={objectColor}
          onChange={(event) => setObjectColor(event.target.value)}
        >
          <option value="">No color</option>
          {objectColor && !colorOptions.includes(objectColor) && (
            <option
              value={objectColor}
              onChange={(e) => setObjectColor(e.target?.value)}
            >
              Current color ({objectColor})
            </option>
          )}
          {[...COLOR_OPTIONS]
            .sort((a, b) => a.localeCompare(b))
            .map((colorOption) => (
              <option
                key={colorOption}
                value={colorOption}
                label={`${
                  colorOption.charAt(0).toUpperCase() + colorOption.slice(1)
                }`}
              >
                {colorOption}
              </option>
            ))}
        </StyledSelect>

        <StyledButton
          style={{ height: "40px", marginTop: "4px" }}
          onClick={createNewObject}
          disabled={!objectName.trim() || isCreating}
        >
          {isCreating ? "Creating..." : "Create"}
        </StyledButton>
        {error && <p role="alert">{error}</p>}
      </ObjectBox>
    </>
  );
};

export { CreateObject };
