"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteObject, updateObject } from "@/app/actions";
import { COLOR_OPTIONS } from "@/components/theme";

type EditObjectProps = {
  objectId: string;
  name: string;
  color: string | null;
  fields: { id: string; name: string }[];
};

const EditObject = ({ objectId, name, color, fields }: EditObjectProps) => {
  const router = useRouter();
  const colorOptions: readonly string[] = COLOR_OPTIONS;
  const [objectName, setObjectName] = useState(name);
  const [objectColor, setObjectColor] = useState(color ?? "");
  const [fieldNames, setFieldNames] = useState(
    fields.map((field) => field.name),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
          fields: fieldNames
            .map((fieldName) => fieldName.trim())
            .filter(Boolean)
            .map((fieldName) => ({ name: fieldName })),
        },
      });
      setObjectName(updatedObject.name);
      setObjectColor(updatedObject.color ?? "");
      setFieldNames(updatedObject.fields.map((field) => field.name));
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
    <form onSubmit={saveObject}>
      <h2>Edit object</h2>
      <div>
        <label htmlFor={`object-name-${objectId}`}>Name</label>
        <input
          id={`object-name-${objectId}`}
          value={objectName}
          onChange={(event) => setObjectName(event.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor={`object-color-${objectId}`}>Color</label>
        <select
          id={`object-color-${objectId}`}
          value={objectColor}
          onChange={(event) => setObjectColor(event.target.value)}
        >
          <option value="">No color</option>
          {objectColor && !colorOptions.includes(objectColor) && (
            <option value={objectColor}>Current color ({objectColor})</option>
          )}
          {COLOR_OPTIONS.map((colorOption) => (
            <option key={colorOption} value={colorOption}>
              {colorOption}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend>Fields</legend>
        {fieldNames.map((fieldName, index) => (
          <div key={index}>
            <input
              aria-label={`Field ${index + 1} name`}
              value={fieldName}
              onChange={(event) =>
                setFieldNames((currentFields) =>
                  currentFields.map((currentName, currentIndex) =>
                    currentIndex === index ? event.target.value : currentName,
                  ),
                )
              }
            />
            <button
              type="button"
              onClick={() =>
                setFieldNames((currentFields) =>
                  currentFields.filter(
                    (_, currentIndex) => currentIndex !== index,
                  ),
                )
              }
            >
              Remove field
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFieldNames((currentFields) => [...currentFields, ""])
          }
        >
          Add field
        </button>
      </fieldset>
      <button type="submit" disabled={isSaving || isDeleting}>
        {isSaving ? "Saving..." : "Save changes"}
      </button>
      <button
        type="button"
        onClick={removeObject}
        disabled={isSaving || isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete object"}
      </button>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </form>
  );
};

export { EditObject };
