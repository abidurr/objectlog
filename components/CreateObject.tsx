"use client";

import { useState } from "react";
import { createObject } from "@/app/actions";

type CreateObjectProps = {
  session: {
    user?: {
      id?: string;
      email?: string;
    };
  } | null;
};

const CreateObject = ({ session }: CreateObjectProps) => {
  const [objectName, setObjectName] = useState("");

  const createNewObject = async (inputName: string) => {
    const userId = session?.user?.id;
    const email = session?.user?.email;

    if (!userId || !email) {
      return;
    }

    return await createObject({
      userId,
      email,
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
