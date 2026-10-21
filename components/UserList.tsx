import React from "react";

const UserList = async ({ users }: { users: any[] }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export { UserList };
