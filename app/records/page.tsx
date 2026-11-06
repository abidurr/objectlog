import { Suspense } from "react";
import {
  Container,
  CreateObject,
  Header,
  Login,
  UserNavigation,
} from "@/components/";
import { auth0 } from "@/lib/auth0";
import { getObjects } from "@/app/actions";
import { ObjectsList } from "@/app/objects/ObjectsList";

async function RecordsContent() {
  const session = await auth0.getSession();
  if (!session) {
    return <Login />;
  }

  const userEmail = session.user?.email?.toLowerCase() ?? "";
  const objects = await getObjects(userEmail);

  return (
    <>
      <UserNavigation session={session} />
      <ObjectsList objects={objects} objectHrefBase="/records" />
      <CreateObject />
    </>
  );
}

export default function RecordsPage() {
  return (
    <>
      <Header />
      <Container>
        <Suspense fallback={<p>Loading user objects...</p>}>
          <RecordsContent />
        </Suspense>
      </Container>
    </>
  );
}
