"use client";

import { useState } from "react";

const CreateObject = (session: unknown) => {
  const [objectName, setObjectName] = useState("");

  const createNewObject = async (inputName: string) => {
    return await createObject({
      userId: session?.user?.id,
      email: session?.user?.email,
      input: { name: inputName, fields: [] },
    });
  };
  return (
    <>
      <h3>Create new object</h3>
      <p>Name</p>
      <input
        value={objectName}
        onChange={(e) => setObjectName(e.target.value)}
      />
      <button onClick={() => createNewObject(objectName)} />
    </>
  );
};

export { CreateObject };
