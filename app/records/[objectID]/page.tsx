import { Suspense } from "react";
import {
  Container,
  Header,
  Login,
  StyledButton,
  UserNavigation,
} from "@/components/";
import { RecordForm } from "@/components/RecordForm";
import { auth0 } from "@/lib/auth0";
import { getObject, getRecords } from "@/app/actions";
import { RecordsTable } from "./RecordsTable";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 20px 0 32px;

  a,
  span {
    color: inherit;
  }

  [aria-disabled="true"] {
    opacity: 0.45;
  }

  p {
    margin: 0;
    text-align: center;
  }
`;

export default function RecordsForObjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ objectID: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense
        fallback={
          <Container>
            <p>Loading records...</p>
          </Container>
        }
      >
        {Promise.all([params, searchParams]).then(
          ([{ objectID }, { page }]) => (
            <RecordsContent objectID={objectID} pageParam={page} />
          ),
        )}
      </Suspense>
    </>
  );
}

async function RecordsContent({
  objectID,
  pageParam,
}: {
  objectID: string;
  pageParam?: string | string[];
}) {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <Container>
        <Login />
      </Container>
    );
  }

  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const requestedPage = Number.parseInt(pageValue ?? "1", 10);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const [object, recordPage] = await Promise.all([
    getObject(objectID),
    getRecords(objectID, page),
  ]);

  if (!object) {
    notFound();
  }

  const lastPage = Math.max(recordPage.totalPages, 1);
  if (page > lastPage) {
    redirect(`/records/${objectID}?page=${lastPage}`);
  }

  return (
    <>
      <UserNavigation session={session} />
      <Container>
        <Link href="/records" style={{ textDecoration: "none" }}>
          <StyledButton type="button">
            <FiArrowLeft />
            Back to Records
          </StyledButton>
        </Link>
        <h1>{object.name} Records</h1>
        <RecordsTable
          objectId={object.id}
          fields={object.fields}
          records={recordPage.records}
        />
        <Pagination aria-label="Record pages">
          {page > 1 ? (
            <Link href={`/records/${objectID}?page=${page - 1}`}>Previous</Link>
          ) : (
            <span aria-disabled="true">Previous</span>
          )}
          <p>
            Page {page} of {lastPage} ({recordPage.total} records)
          </p>
          {page < recordPage.totalPages ? (
            <Link href={`/records/${objectID}?page=${page + 1}`}>Next</Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
        </Pagination>
        <RecordForm
          objectId={object.id}
          fields={object.fields}
          key={object.fields
            .map((field) => `${field.id}:${field.fieldType}`)
            .join("|")}
        />
      </Container>
    </>
  );
}
