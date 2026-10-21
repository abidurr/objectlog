import { Header, Container, UserList } from "@/components";
import Image from "next/image";
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
      <Container>
        <h1>Users page</h1>
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersContent />
        </Suspense>
      </Container>
    </>
  );
}
