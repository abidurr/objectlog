"use client";

import { useState } from "react";
import { createObject } from "@/app/actions";

const CreateObject = () => {
  const [objectName, setObjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const createNewObject = async () => {
    const name = objectName.trim();
    if (!name || isCreating) {
      return;
    }

    setIsCreating(true);
    setError("");
    try {
      await createObject({ input: { name, fields: [] } });
      setObjectName("");
    } catch {
      setError("Could not create object. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <>
      <h3>Create new object</h3>
      <input
        style={{ width: "232px" }}
        placeholder="Object name, e.g. 'Book', 'Friend' etc."
        value={objectName}
        onChange={(e) => setObjectName(e.target.value)}
      />
      <button
        onClick={createNewObject}
        disabled={!objectName.trim() || isCreating}
      >
        {isCreating ? "Creating..." : "Create"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export { CreateObject };
