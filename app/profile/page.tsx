import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";
import { LoggedInUser } from "@/components/LoggedInUser";

export default function Profile() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        {/* <h1>Profile</h1> */}
        <Suspense fallback={<div>Loading user...</div>}>
          <LoggedInUser />
        </Suspense>
      </Container>
    </>
  );
}
