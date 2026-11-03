"use client";
import { useAtom } from "jotai";
import { isLoggedInAtom, loggedInUserAtom } from "@/components/atoms";
import { StyledButton } from "./StyledBits";
import Link from "next/link";

const Login = () => {
  return (
    <div>
      <h1>Not logged in</h1>
      <Link style={{ textDecoration: "none" }} href="/auth/login">
        <StyledButton>Log in or sign up</StyledButton>
      </Link>
    </div>
  );
};

const LoginOld = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [loggedInUser, setLoggedInUser] = useAtom(loggedInUserAtom);

  const handleLogin = () => {
    if (isLoggedIn) {
      // Logout logic
      setIsLoggedIn(false);
      setLoggedInUser(null);
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
