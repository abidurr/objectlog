import {
  Header,
  Container,
  UserList,
  LoggedInUser,
  UserNavigation,
} from "@/components";
import { getUsers } from "@/app/actions";
import { Suspense } from "react";

async function UsersContent() {
  const users = await getUsers();
  return <UserList users={users} />;
}

export default async function Users() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        {/* <h1>User profile</h1>
        <Suspense fallback={<div>Loading user...</div>}>
          <LoggedInUser />
        </Suspense */}
        <h1>All users</h1>
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersContent />
        </Suspense>
      </Container>
    </>
  );
}
