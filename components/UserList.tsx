import type { getUsers } from "@/app/actions";

const UserList = ({
  users,
}: {
  users: Awaited<ReturnType<typeof getUsers>>;
}) => {
  return (
    <ul>
      {users?.map((user) => (
        <li key={user?.id}>{user?.name}</li>
      ))}
    </ul>
  );
};

export { UserList };
