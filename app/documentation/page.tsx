import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";

export default function Documentation() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>Documentation</h1>
        <ol>
          <li>Make the Objects you need.</li>
          <li>Add Fields to the Object.</li>
          <li>Add Records for each Object.</li>
          <li>Add the Fields for each Record.</li>
          <li>Use Views to organize all your data.</li>
        </ol>
        <p></p>
      </Container>
    </>
  );
}
