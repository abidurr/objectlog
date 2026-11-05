"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteObject, updateObject } from "@/app/actions";
import { COLOR_OPTIONS, getBackgroundForColor } from "@/components/theme";
import {
  ObjectBox,
  StyledButton,
  StyledInput,
  StyledSelect,
  FieldsList,
  FieldInfo,
  FieldLabelSpan,
} from "@/components/StyledBits";
import { FiEye, FiTrash2, FiEdit } from "react-icons/fi";
import { IoBrushOutline } from "react-icons/io5";

type EditObjectProps = {
  objectId: string;
  name: string;
  color: string | null;
};

const EditObject = ({ objectId, name, color }: EditObjectProps) => {
  const router = useRouter();
  const colorOptions: readonly string[] = COLOR_OPTIONS;
  const [objectName, setObjectName] = useState(name);
  const [objectColor, setObjectColor] = useState(color ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveObject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = objectName.trim();
    if (isSaving || isDeleting) {
      return;
    }
    if (!trimmedName) {
      setError("Object name is required.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const updatedObject = await updateObject({
        objectId,
        input: {
          name: trimmedName,
          color: objectColor.trim() || null,
        },
      });
      setObjectName(updatedObject.name);
      setObjectColor(updatedObject.color ?? "");
      setMessage("Object updated.");
    } catch {
      setError("Could not update object. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeObject = async () => {
    if (isSaving || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setMessage("");
    setError("");

    try {
      await deleteObject(objectId);
      router.push("/objects");
    } catch {
      setError("Could not delete object. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <ObjectBox>
      <form onSubmit={saveObject}>
        <div>
          {!areYouSure && (
            <StyledButton
              $btnclr="red"
              type="button"
              onClick={() => setAreYouSure(true)}
              disabled={isSaving || isDeleting || areYouSure}
            >
              <FiTrash2 />
              {isDeleting ? "Deleting..." : `Delete Object`}
            </StyledButton>
          )}
          <FieldsList>
            <FieldInfo>
              <FiEye />
              <FieldLabelSpan>Name</FieldLabelSpan>
            </FieldInfo>

            <FieldInfo>
              <StyledInput
                id={`object-name-${objectId}`}
                value={objectName}
                onChange={(event) => setObjectName(event.target.value)}
                required
              />
            </FieldInfo>
            <FieldInfo>
              <IoBrushOutline />
              <FieldLabelSpan>Color</FieldLabelSpan>
            </FieldInfo>
            <StyledSelect
              style={{
                backgroundColor: getBackgroundForColor(
                  objectColor?.toLowerCase(),
                ),
              }}
              id={`object-color-${objectId}`}
              value={objectColor}
              onChange={(event) => setObjectColor(event?.target?.value)}
            >
              <option value="">No color</option>
              {objectColor && !colorOptions.includes(objectColor) && (
                <option value={objectColor}>
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
          </FieldsList>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <StyledButton
            $btnclr="green"
            type="submit"
            disabled={isSaving || isDeleting}
          >
            <FiEdit />
            {isSaving ? "Saving..." : "Edit Object"}
          </StyledButton>

          {areYouSure && (
            <>
              <p style={{ maxWidth: "200px" }}>
                Are you sure you want to delete your object {name}? This will
                also delete all your records, fields, and logs.
              </p>
              <StyledButton
                onClick={() => setAreYouSure(false)}
                $btnclr="green"
                disabled={isSaving || isDeleting}
              >
                No, go back
              </StyledButton>
              <StyledButton
                $btnclr="red"
                type="button"
                onClick={removeObject}
                disabled={isSaving || isDeleting}
              >
                <FiTrash2 />
                {isDeleting ? "Deleting..." : `Yes, delete ${name}`}
              </StyledButton>
            </>
          )}
        </div>
        {message && <p role="status">{message}</p>}
        {error && <p role="alert">{error}</p>}
      </form>
    </ObjectBox>
  );
};

export { EditObject };
