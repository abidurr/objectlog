import React from "react";

interface UserType {
  id: string;
  email: string;
  username?: string;
  name?: string;
  objects: object[];
  createdAt: datetime;
  updatedAt: DateTime;
}

const UserList = async ({ users }: { users: UserType[] }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export { UserList };
