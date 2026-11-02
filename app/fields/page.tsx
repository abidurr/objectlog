import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";

export default function Fields() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>Fields page</h1>
      </Container>
    </>
  );
}
