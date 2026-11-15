import { Suspense } from "react";
import Link from "next/link";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import {
  Container,
  Header,
  Login,
  UserNavigation,
} from "@/components/";
import { ObjectBox } from "@/components/StyledBits";
import { getRecordChangeLogs } from "@/app/actions";
import { auth0 } from "@/lib/auth0";
import { notFound } from "next/navigation";

const VALUE_KEYS: Record<string, string> = {
  TEXT: "text_value",
  LONGTEXT: "longtext_value",
  DATE: "date_value",
  DATETIME: "datetime_value",
  SELECT: "select_value",
  MULTISELECT: "multiselect_value",
  ROUNDNUMBER: "roundnumber_value",
};

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: inherit;
  text-decoration: none;
`;

const CurrentRecordCard = styled(ObjectBox)`
  box-sizing: border-box;
  width: 100%;
`;

const CurrentRecordFields = styled.dl`
  display: grid;
  gap: 12px;
  margin: 0;

  > div {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) 3fr;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #d8ded8;
  }

  > div:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  dt {
    font-weight: 650;
  }

  dd {
    margin: 0;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  @media (max-width: 600px) {
    > div {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
`;

const HistoryTable = styled.table`
  width: 100%;
  margin: 16px 0 32px;
  border-collapse: collapse;
  background: #fff;

  th,
  td {
    padding: 11px 14px;
    border: 1px solid #e6eae6;
    text-align: left;
    vertical-align: top;
    color: #152a22;
    overflow-wrap: anywhere;
  }

  th {
    background: #f3f6f2;
  }
`;

function getRecordFields(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (Array.isArray(value)) {
    return value.map(formatValue).join(", ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function formatLoggedValue(value: string | null): string {
  if (value === null) {
    return "—";
  }
  try {
    return formatValue(JSON.parse(value) as unknown);
  } catch {
    return value;
  }
}

export default function RecordLogsPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense
        fallback={
          <Container>
            <p>Loading record logs...</p>
          </Container>
        }
      >
        {params.then(({ recordId }) => (
          <RecordLogsContent recordId={recordId} />
        ))}
      </Suspense>
    </>
  );
}

async function RecordLogsContent({ recordId }: { recordId: string }) {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <Container>
        <Login />
      </Container>
    );
  }

  const data = await getRecordChangeLogs(recordId);
  if (!data) {
    notFound();
  }

  const currentFields = getRecordFields(data.record.fields);

  return (
    <>
      <UserNavigation session={session} />
      <Container>
        <BackLink href={`/records/${data.object.id}`}>
          <FiArrowLeft aria-hidden="true" />
          Back to records
        </BackLink>
        <h1>{data.record.name} Logs</h1>

        <h2>Current record data</h2>
        <CurrentRecordCard>
          <CurrentRecordFields>
            <div>
              <dt>Name</dt>
              <dd>{data.record.name}</dd>
            </div>
            {data.record.description != null && (
              <div>
                <dt>Description</dt>
                <dd>{data.record.description}</dd>
              </div>
            )}
            {data.object.fields.map((field) => {
              const fieldData = getRecordFields(currentFields[field.id]);
              return (
                <div key={field.id}>
                  <dt>{field.name}</dt>
                  <dd>{formatValue(fieldData[VALUE_KEYS[field.fieldType]])}</dd>
                </div>
              );
            })}
          </CurrentRecordFields>
        </CurrentRecordCard>

        <h2>Change history</h2>
        <HistoryTable>
          <thead>
            <tr>
              <th scope="col">Changed</th>
              <th scope="col">Field</th>
              <th scope="col">Old value</th>
              <th scope="col">New value</th>
            </tr>
          </thead>
          <tbody>
            {data.changeLogs.length === 0 ? (
              <tr>
                <td colSpan={4}>No changes have been recorded.</td>
              </tr>
            ) : (
              data.changeLogs.map((change) => (
                <tr key={change.id}>
                  <td>
                    {change.createdAt
                      ? new Date(change.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <th scope="row">{change.fieldName}</th>
                  <td>{formatLoggedValue(change.oldValue)}</td>
                  <td>{formatLoggedValue(change.newValue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </HistoryTable>
      </Container>
    </>
  );
}
