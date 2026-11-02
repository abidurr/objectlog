import { Suspense } from "react";
import { getObject } from "@/app/actions";
import {
  Container,
  Header,
  UserNavigation,
  LetterIcon,
  ObjectBox,
  IconAndTitle,
} from "@/components/";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/components/theme";

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
        <h1>Object details</h1>
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

  return (
    <>
      <Link href="/objects">
        <button style={{ marginLeft: "8px", padding: "4px 8px" }}>
          Back to Objects
        </button>
      </Link>
      <ObjectBox>
        <IconAndTitle>
          <LetterIcon color={object?.color ?? undefined}>
            {object?.name?.charAt(0).toUpperCase()}
          </LetterIcon>
          <h3>{object?.name}</h3>
        </IconAndTitle>
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
      <h1>{object?.name}</h1>
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
        <dd>{object?.color}</dd>
        <dt>Fields</dt>
        <dd>
          {object ? (
            object.fields.length > 0 ? (
              <ul>
                {object.fields.map((field) => (
                  <li key={field.id}>{field.name}</li>
                ))}
              </ul>
            ) : (
              "None"
            )
          ) : (
            "Object not found"
          )}
        </dd>
      </dl>
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
