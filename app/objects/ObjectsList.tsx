"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import type { getObjects } from "@/app/actions";
import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";
import {
  LetterIcon,
  ObjectBox,
  IconAndTitle,
  ObjectsGrid,
  FieldInfo,
  FieldLabelSpan,
  FieldsList,
} from "@/components/StyledBits";
import { FiBookmark, FiClock } from "react-icons/fi";
import { IoBrushOutline } from "react-icons/io5";

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
      <ObjectsGrid>
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
                  <FieldInfo>
                    <FiBookmark />
                    <FieldLabelSpan>id</FieldLabelSpan>
                    <FieldLabelSpan>{object?.id}</FieldLabelSpan>
                  </FieldInfo>
                  <FieldInfo>
                    <IoBrushOutline />
                    <FieldLabelSpan>color</FieldLabelSpan>
                    {object?.color ?? "Not available"}
                  </FieldInfo>
                  <FieldInfo>
                    <FiClock />
                    <FieldLabelSpan>updated</FieldLabelSpan>
                    {object.updatedAt?.toLocaleString() ?? "Not available"}
                  </FieldInfo>
                  <FieldInfo>
                    <FiClock />
                    <FieldLabelSpan>created</FieldLabelSpan>
                    {object.createdAt?.toLocaleString() ?? "Not available"}
                  </FieldInfo>
                </FieldsList>
              </ObjectBox>
            </Link>
          </div>
        ))}
      </ObjectsGrid>
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
