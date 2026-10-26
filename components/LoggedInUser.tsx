import { auth0 } from "@/lib/auth0";

const LoggedInUser = async () => {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <>
        {/* Redirects to Auth0 to sign up */}
        <a href="/auth/login?screen_hint=signup">Signup</a>
        <br />
        {/* Redirects to Auth0 to log in */}
        <a href="/auth/login">Login</a>
      </>
    );
  }
  return (
    <>
      <p>Logged in as {session.user.email}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>

      <a href="/auth/logout">
        <button>Logout</button>
      </a>
    </>
  );
};

export { LoggedInUser };
