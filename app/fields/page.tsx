import { Suspense } from "react";
import styled from "styled-components";
import { Header, Container, UserNavigation } from "@/components";
import { Login } from "@/components/Login";
import { RecordForm } from "@/components/RecordForm";
import { getObjectsWithRecentRecords } from "@/app/actions";
import { auth0 } from "@/lib/auth0";
import { Prisma } from "@prisma/client";

const ObjectSection = styled.section`
  padding: 24px 0;
  border-top: 1px solid #ccc;

  h2 {
    margin: 0 0 16px;
  }
`;

const TableWrap = styled.div`
  max-width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  th,
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #ccc;
    vertical-align: top;
  }

  th {
    white-space: nowrap;
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

function getComputedValue(
  recordFields: Prisma.JsonValue | null,
  fieldId: string,
) {
  if (
    recordFields === null ||
    Array.isArray(recordFields) ||
    typeof recordFields !== "object"
  ) {
    return "-";
  }

  const fieldValue = recordFields[fieldId];
  if (
    fieldValue === null ||
    Array.isArray(fieldValue) ||
    typeof fieldValue !== "object"
  ) {
    return "-";
  }

  const value = fieldValue.computed_value;
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

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
                <TableWrap>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Record</th>
                        {visibleFields.map((field) => (
                          <th scope="col" key={field.id}>
                            {field.name}
                          </th>
                        ))}
                        <th scope="col">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {object.records.map((record) => (
                        <tr key={record.id}>
                          <th scope="row">{record.name}</th>
                          {visibleFields.map((field) => (
                            <td key={field.id}>
                              {getComputedValue(record.fields, field.id)}
                            </td>
                          ))}
                          <td>{record.createdAt?.toLocaleString() ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
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
