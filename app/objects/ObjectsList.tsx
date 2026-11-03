"use client";
import type { getObjects } from "@/app/actions";
import Link from "next/link";
import styled from "styled-components";
import {
  LetterIcon,
  ObjectBox,
  IconAndTitle,
  ObjectsGrid,
  FieldInfo,
  FieldLabelSpan,
  FieldsList,
  ColorPill,
} from "@/components/StyledBits";
import { FiBookmark, FiClock } from "react-icons/fi";
import { IoBrushOutline } from "react-icons/io5";
import { getBackgroundForColor } from "../../components/theme";
import moment from "moment-timezone";

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
      <h1>My Objects</h1>
      <p>
        Below are the objects you made. You can click into one to update its
        fields and add records for the object.
      </p>
      &nbsp;
      <ObjectsGrid>
        {objects?.map((object) => (
          <div key={object.id}>
            <Link href={`/objects/${object?.id}`}>
              <ObjectBox>
                <IconAndTitle>
                  <LetterIcon
                    color={object?.color ?? undefined}
                    bgcolor={getBackgroundForColor(object?.color)}
                  >
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
                    <ColorPill
                      textclr={object.color ?? "black"}
                      bgclr={getBackgroundForColor(object?.color)}
                    >
                      {object?.color ?? "No color"}
                    </ColorPill>
                  </FieldInfo>
                  <FieldInfo>
                    <FiClock />
                    <FieldLabelSpan>updated</FieldLabelSpan>
                    {object?.updatedAt
                      ? moment(object?.updatedAt).format("llll")
                      : "Not available"}
                  </FieldInfo>
                  <FieldInfo>
                    <FiClock />
                    <FieldLabelSpan>created</FieldLabelSpan>
                    {object?.createdAt
                      ? moment(object?.createdAt).format("llll")
                      : "Not available"}
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
