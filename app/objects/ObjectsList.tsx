"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import type { getObjects } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";
import { LetterIcon, ObjectBox, IconAndTitle } from "@/components/StyledBits";

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
                <LetterIcon color={object?.color ?? undefined}>
                  {object?.name?.charAt(0).toUpperCase()}
                </LetterIcon>
                <h3>{object?.name}</h3>
              </IconAndTitle>
              {/* <p>{JSON.stringify(object)}</p> */}
              <FieldsList>
                <p>
                  <FieldLabelSpan>id</FieldLabelSpan>
                  <FieldLabelSpan>{object?.id}</FieldLabelSpan>
                </p>
                <p>
                  <FieldLabelSpan>color</FieldLabelSpan>
                  {object?.color}
                </p>
                <p>
                  <FieldLabelSpan>updated</FieldLabelSpan>
                  {object.updatedAt?.toLocaleString() ?? "Not available"}
                </p>
                <p>
                  <FieldLabelSpan>created</FieldLabelSpan>
                  {object.createdAt?.toLocaleString() ?? "Not available"}
                </p>
              </FieldsList>
            </ObjectBox>
          </Link>
        </div>
      ))}
    </StyledObjects>
  );
};

const FieldLabelSpan = styled.span`
  display: inline-block;
  /* color: ${theme.PRIMARY_800}; */
  opacity: 0.4;
  font-family: monospace;
  font-size: 16px;
  margin-right: 8px;
  min-width: 80px;
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  p {
    margin: 0;
    padding: 0;
  }
`;

const StyledObjects = styled.div`
  a {
    color: white;
    text-decoration: none;
  }
`;

export { ObjectsList };
