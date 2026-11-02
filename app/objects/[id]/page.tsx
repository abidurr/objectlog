import { Suspense } from "react";
import { getObject } from "@/app/actions";
import { Container, Header, UserNavigation } from "@/components/";

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
        <dd>{new Date(object?.updatedAt).toLocaleDateString()}</dd>
        <dt>createdAt</dt>
        <dd>{new Date(object?.createdAt).toLocaleDateString()}</dd>
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
