"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import type { getObjects } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";
import { LetterIcon } from "@/components/LetterIcon";

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
            <ObjectBox color={object?.color}>
              <IconAndTitle>
                <LetterIcon>{object?.name?.charAt(0).toUpperCase()}</LetterIcon>
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

const IconAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ObjectBox = styled.div<{ color?: string }>`
  border: 1px solid #ccc;
  padding: 24px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(p) => p.color || theme.PRIMARY_400};
  color: ${theme.BLACK_TEXT_COLOR};
  min-width: 300px;
`;

const StyledObjects = styled.div`
  a {
    color: white;
    text-decoration: none;
  }
`;

export { ObjectsList };
