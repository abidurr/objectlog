import { Suspense } from "react";
import { getObject } from "@/app/actions";
import {
  Container,
  Header,
  UserNavigation,
  LetterIcon,
  ObjectBox,
  IconAndTitle,
  StyledButton,
  FieldInfo,
  ObjectsGrid,
  EditObject,
  ObjectFields,
} from "@/components/";
import { RecordForm } from "@/components/RecordForm";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";
import { FiArrowLeft, FiBookmark, FiClock } from "react-icons/fi";
import { IoBrushOutline } from "react-icons/io5";
import { ColorPill } from "@/components/StyledBits";
import { getBackgroundForColor } from "@/components/theme";
import moment from "moment-timezone";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        {/* <h1>Object details</h1> */}
        <Suspense fallback={<p>Loading object...</p>}>
          {params.then(({ id }) => (
            <ObjectDetails id={id} />
          ))}
        </Suspense>
      </Container>
    </>
  );
}

async function ObjectDetails({ id }: { id: string }) {
  const object = await getObject(id);

  if (!object) {
    return (
      <>
        <Link style={{ textDecoration: "none" }} href="/objects">
          <StyledButton>
            <FiArrowLeft />
            Back to Objects
          </StyledButton>
        </Link>
        <p>Object not found</p>
      </>
    );
  }
  return (
    <>
      <Link style={{ textDecoration: "none" }} href="/objects">
        <StyledButton>
          <FiArrowLeft />
          Back to Objects
        </StyledButton>
      </Link>
      <ObjectsGrid>
        <ObjectBox style={{ height: "fit-content" }}>
          <IconAndTitle>
            <LetterIcon
              $color={object?.color ?? undefined}
              $bgcolor={getBackgroundForColor(object?.color)}
            >
              {object?.name?.charAt(0).toUpperCase()}
            </LetterIcon>
            <h3>{object?.name}</h3>
          </IconAndTitle>
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
                $textclr={object.color ?? "black"}
                $bgclr={getBackgroundForColor(object?.color)}
              >
                {object?.color ?? "Not available"}
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
        <EditObject
          objectId={object.id}
          name={object.name}
          color={object.color}
        />
      </ObjectsGrid>
      <ObjectFields objectId={object.id} fields={object.fields} />
      <RecordForm
        objectId={object.id}
        fields={object.fields}
        key={object.fields
          .map((field) => `${field.id}:${field.fieldType}`)
          .join("|")}
      />
      {/* <h1>{object?.name}</h1>
      <dl>
        <dt>ID</dt>
        <dd>{id}</dd>
        <dt>Name</dt>
        <dt>ID: {object?.id}</dt>
        <p>Name: {object?.name}</p>
        <p>color: {object?.color}</p>
        <dd>{object?.name ?? "Not found"}</dd>
        <dt>updatedAt</dt>
        <dd>{object?.updatedAt?.toLocaleDateString() ?? "Not available"}</dd>
        <dt>createdAt</dt>
        <dd>{object?.createdAt?.toLocaleDateString() ?? "Not available"}</dd>
        <dt>color</dt>
        <dd>{object?.color ?? "Not available"}</dd>
      </dl> */}
    </>
  );
}

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
