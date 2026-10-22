import React from "react";

// interface UserType {
//   id: string;
//   email: string;
//   username?: string;
//   name?: string;
//   objects: any[];
//   createdAt: datetime;
//   updatedAt: DateTime;
// }

const UserList = async ({ users }: { users: unknown[] }) => {
  return (
    <ul>
      {users?.map((user) => (
        <li key={user?.id}>{user?.name}</li>
      ))}
    </ul>
  );
};

export { UserList };
