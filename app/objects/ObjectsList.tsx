"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import type { getObjects } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";
import { LetterIcon, ObjectBox, IconAndTitle } from "@/components/";

const ObjectsList = ({
  objects,
}: {
  objects: Awaited<ReturnType<typeof getObjects>>;
}) => {
  // const [isLoggedIn] = useAtom(isLoggedInAtom);
  // const [objects] = useState<Awaited<ReturnType<typeof getObjects>>>([]);

  // if (!isLoggedIn) {
  //   return (
  //     <>
  //       <p>You must be logged in to view the objects list.</p>
  //     </>
  //   );
  // } else {

  return (
    <StyledObjects>
      <p>These are the objects you made:</p>
      {objects?.map((object) => (
        <div key={object.id}>
          <Link href={`/objects/${object?.id}`}>
            <ObjectBox>
              <IconAndTitle>
                <LetterIcon color={object?.color}>
                  {object?.name?.charAt(0).toUpperCase()}
                </LetterIcon>
                <h3>{object?.name}</h3>
              </IconAndTitle>
              {/* <p>{JSON.stringify(object)}</p> */}
              <p>ID: {object?.id}</p>
              <p>Name: {object?.name}</p>
              <p>
                updatedAt: {new Date(object?.updatedAt).toLocaleDateString()}
              </p>
              <p>
                createdAt: {new Date(object?.createdAt).toLocaleDateString()}
              </p>
              <p>color: {object?.color}</p>
            </ObjectBox>
          </Link>
        </div>
      ))}
    </StyledObjects>
  );
};

const StyledObjects = styled.div`
  a {
    color: white;
    text-decoration: none;
  }
`;

export { ObjectsList };
