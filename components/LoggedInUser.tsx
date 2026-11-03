import { auth0 } from "@/lib/auth0";
import styled from "styled-components";
import Image from "next/image";
import { ObjectBox, StyledButton } from "@/components/StyledBits";
import Link from "next/link";

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

  // "user": {
  //   "nickname": "abidur",
  //   "name": "abidur@test.com",
  //   "picture": "https://s.gravatar.com/avatar/72d2db222f3d70e959445a58f74f672f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fab.png",
  //   "email": "abidur@test.com",
  //   "email_verified": false,
  //   "sub": "auth0|6ae3dd916ed5a5a7dd9aa1d7"

  return (
    <>
      <p>Logged in as {session.user.email}</p>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <ObjectBox>
        <FlexDiv>
          {/* <h3>Picture</h3> */}
          {session.user.picture ? (
            <Image
              style={{ borderRadius: "16px", marginBottom: "12px" }}
              src={session.user.picture}
              alt="User Picture"
              width={120}
              height={120}
            />
          ) : (
            <p>Profile picture unavailable</p>
          )}
        </FlexDiv>
        <FlexDiv>
          <h3>Nickname</h3>
          <p>{session.user.nickname}</p>
        </FlexDiv>
        <FlexDiv>
          <h3>Name</h3>
          <p>{session.user.name}</p>
        </FlexDiv>
        <FlexDiv>
          <h3>Email</h3>
          <p>{session.user.email}</p>
        </FlexDiv>
        <FlexDiv>
          <h3>Verified</h3>
          <p>{session.user.email_verified ? "Yes" : "No"}</p>
        </FlexDiv>
        <FlexDiv>
          <h3>Sub</h3>
          <p>{session.user.sub}</p>
        </FlexDiv>
        <FlexDiv>
          <h3>Token expires at</h3>
          <p>{new Date(session.user.exp).toLocaleString()}</p>
        </FlexDiv>
      </ObjectBox>
      {/* <h3>Picture</h3> */}

      <FlexDiv>
        <Link style={{ textDecoration: "none" }} href="/auth/logout">
          <StyledButton>Logout</StyledButton>
        </Link>
      </FlexDiv>
    </>
  );
};

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  h3 {
    margin: 4px 8px 4px 0;
    font-size: 16px;
    font-weight: bold;
  }
  p {
    margin: 4px 8px 4px 0;
    font-size: 16px;
    font-weight: normal;
  }
`;

export default LoggedInUser;

export { LoggedInUser };
