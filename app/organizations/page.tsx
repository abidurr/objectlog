import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";

export default async function Organizations() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>Organizations page</h1>
      </Container>
    </>
  );
}
