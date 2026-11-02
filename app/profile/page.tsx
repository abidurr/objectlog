import { Suspense } from "react";
import { Header, Container, LoggedInUser, UserNavigation } from "@/components";

export default function Profile() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>Profile</h1>
        <Suspense fallback={<div>Loading user...</div>}>
          <LoggedInUser />
        </Suspense>
      </Container>
    </>
  );
}
