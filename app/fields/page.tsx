import { Suspense } from "react";
import styled from "styled-components";
import { Header, Container, UserNavigation } from "@/components";
import { Login } from "@/components/Login";
import { RecordForm } from "@/components/RecordForm";
import { RecentRecordsTable } from "./RecentRecordsTable";
import { getObjectsWithRecentRecords } from "@/app/actions";
import { auth0 } from "@/lib/auth0";

const ObjectSection = styled.section`
  padding: 24px 0;
  border-top: 1px solid #ccc;

  h2 {
    margin: 0 0 16px;
  }
`;

const AddRecordDetails = styled.details`
  margin-top: 20px;

  summary {
    width: fit-content;
    cursor: pointer;
    font-weight: 700;
  }
`;

async function FieldsContent() {
  const session = await auth0.getSession();
  if (!session?.user?.email) {
    return <Login />;
  }

  const objects = await getObjectsWithRecentRecords();

  return (
    <>
      <UserNavigation session={session} />
      <h1>Fields</h1>
      {objects.length === 0 ? (
        <p>You do not have any objects yet.</p>
      ) : (
        objects.map((object) => {
          const visibleFields = object.fields.filter((field) => field.visible);

          return (
            <ObjectSection key={object.id}>
              <h2>{object.name}</h2>
              <h3>Recent records</h3>
              {object.records.length === 0 ? (
                <p>No records yet.</p>
              ) : (
                <RecentRecordsTable
                  fields={visibleFields}
                  records={object.records}
                />
              )}
              <AddRecordDetails>
                <summary>Add record for {object.name}</summary>
                <RecordForm
                  objectId={object.id}
                  fields={object.fields}
                  key={`${object.id}:${object.fields
                    .map(
                      (field) =>
                        `${field.id}:${field.fieldType}:${field.visible}`,
                    )
                    .join("|")}`}
                />
              </AddRecordDetails>
            </ObjectSection>
          );
        })
      )}
    </>
  );
}

export default function Fields() {
  return (
    <>
      <Header />
      <Container>
        <Suspense fallback={<p>Loading objects and records...</p>}>
          <FieldsContent />
        </Suspense>
      </Container>
    </>
  );
}
