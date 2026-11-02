import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";

export default function Views() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>Views page</h1>
      </Container>
    </>
  );
}
