import { Container, Header } from "@/components/";
import Image from "next/image";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import { Suspense } from "react";
import { ObjectsList } from "./ObjectsList";
import { Login } from "@/components/Login";
import { auth0 } from "@/lib/auth0";
import { getObjects } from "@/app/actions";

async function ObjectsContent() {
  const session = await auth0.getSession();

  const userEmail = session?.user?.email ?? ""; // "admin@test.com";
  const objects = await getObjects(userEmail);
  return <ObjectsList objects={objects} />;
}

export default async function Objects() {
  return (
    <>
      <Header />
      <Container>
        <h1>Objects</h1>
        <Suspense fallback={<p>Loading user state...</p>}>
          <Login />
        </Suspense>
        <Suspense fallback={<p>Loading user objects...</p>}>
          <ObjectsContent />
        </Suspense>
      </Container>
    </>
  );
}
