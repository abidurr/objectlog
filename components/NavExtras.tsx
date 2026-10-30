"use server";

import Image from "next/image";
import { auth0 } from "../lib/auth0";

export const UserInfo = async () => {
  const userData = await auth0.getSession();
  return (
    <li>
        {userData?.user && (
          <Image src={`${userData?.user?.picture}`} alt="user image" />
        )}
        {userData?.user ? (
          <a href="/auth/logout">
            <button>Logout</button>
          </a>
        ) : (
          <a href="/auth/login">Login</a>
        )}
    </li>
  );
};
