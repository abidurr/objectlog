"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import { Container, Header } from "@/components/";
import { getObjects } from "@/app/actions";
import { useState, useEffect } from "react";

const ObjectsList = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [objects, setObjects] = useState<unknown[]>([]);

  if (!isLoggedIn) {
    return (
      <>
        <p>You must be logged in to view the objects list.</p>
      </>
    );
  } else {
    return (
      <>
        <p>These are the objects you made:</p>
        {objects?.map((object) => (
          <div key={object.id}>
            <h3>{object.name}</h3>
          </div>
        ))}
      </>
    );
  }
};

export { ObjectsList };
