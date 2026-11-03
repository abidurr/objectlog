import { Container, Header, UserNavigation } from "@/components/";
import { Suspense } from "react";
import { ObjectsList } from "./ObjectsList";
import { Login } from "@/components/Login";
import { auth0 } from "@/lib/auth0";
import { getObjects } from "@/app/actions";
import { CreateObject } from "../../components/";

async function ObjectsContent() {
  const session = await auth0.getSession();

  const userEmail = session?.user?.email ?? ""; // "admin@test.com";
  const objects = await getObjects(`${userEmail}`?.toLowerCase());

  if (!session) {
    return (
      <>
        <Suspense fallback={<p>Loading user state...</p>}>
          <Login />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <UserNavigation session={session} />
      <ObjectsList objects={objects} />
      <CreateObject />
    </>
  );
}

export default async function Objects() {
  return (
    <>
      <Header />
      <Container>
        {/*<h1>Objects</h1>*/}
        <Suspense fallback={<p>Loading user objects...</p>}>
          <ObjectsContent />
        </Suspense>
      </Container>
    </>
  );
}
