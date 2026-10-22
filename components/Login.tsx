"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom, loggedInUserAtom } from "@/components/atoms";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [loggedInUser, setLoggedInUser] = useAtom(loggedInUserAtom);

  const handleLogin = () => {
    if (isLoggedIn) {
      // Logout logic
      setIsLoggedIn(false);
      setLoggedInUser(undefined);
    } else {
      // Login logic
      setIsLoggedIn(true);
      setLoggedInUser({
        id: "6ad9ab16b5405f26eef8a91f",
        username: "admin",
        email: "admin@test.com",
        name: "Admin User",
      });
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => handleLogin()}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
      <p>
        {isLoggedIn
          ? `Logged in as ${loggedInUser?.name} with email ${loggedInUser?.email} and username ${loggedInUser?.username}`
          : "Logged out"}
      </p>
    </div>
  );
};

export { Login };
