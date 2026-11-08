import { auth0 } from "@/lib/auth0";
import styled from "styled-components";
import Image from "next/image";
import { ObjectBox, StyledButton } from "@/components/StyledBits";
import Link from "next/link";
import moment from "moment-timezone";
import { theme } from "@/components/theme";
import { getCurrentUserProfile } from "@/app/actions";
import { EditProfile } from "@/components/EditProfile";

const LoggedInUser = async () => {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <>
        <h1>Not logged in</h1>
        <Link style={{ textDecoration: "none" }} href="/auth/login">
          <StyledButton>Log in or sign up</StyledButton>
        </Link>
        {/*<Link
          style={{ textDecoration: "none" }}
          href="/auth/login?screen_hint=signup"
        >
          <StyledButton>Sign up</StyledButton>
        </Link>*/}
      </>
    );
  }

  const databaseUser = await getCurrentUserProfile();

  // "user": {
  //   "nickname": "abidur",
  //   "name": "abidur@test.com",
  //   "picture": "https://s.gravatar.com/avatar/72d2db222f3d70e959445a58f74f672f?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fab.png",
  //   "email": "abidur@test.com",
  //   "email_verified": false,
  //   "sub": "auth0|6ae3dd916ed5a5a7dd9aa1d7"

  return (
    <>
      <h1>My Account</h1>
      {/* <p>Logged in as {session.user.email}</p> */}
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
          <h3 style={{ fontFamily: "monospace" }}>Nickname</h3>
          <p>{session.user.nickname}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Username</h3>
          <p>{databaseUser?.username ?? "-"}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Name</h3>
          <p>
            {databaseUser
              ? (databaseUser.name ?? "-")
              : (session.user.name ?? "-")}
          </p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Email</h3>
          <p>{session.user.email}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Created</h3>
          <p>{moment.unix(session?.internal?.createdAt).format("LLL")}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Verified</h3>
          <p>{session.user.email_verified ? "Yes" : "No"}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Sub</h3>
          <p>{session.user.sub}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>SID</h3>
          <p>{session?.internal?.sid}</p>
        </FlexDiv>
        <FlexDiv>
          <h3 style={{ fontFamily: "monospace" }}>Expires</h3>
          <p>{moment.unix(session?.tokenSet?.expiresAt).format("LLL")}</p>
        </FlexDiv>
      </ObjectBox>
      {databaseUser && (
        <EditProfile
          key={databaseUser.id}
          username={databaseUser.username ?? ""}
          name={databaseUser.name ?? ""}
        />
      )}
      {/* <h3>Picture</h3> */}

      <FlexDiv style={{ marginTop: "24px", marginBottom: "16px" }}>
        <Link style={{ textDecoration: "none" }} href="/auth/logout">
          <StyledButton $btnclr="orange">Logout</StyledButton>
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
    /* color: ${theme.PRIMARY_600}; */
    opacity: 0.3;
  }
  p {
    margin: 4px 8px 4px 0;
    font-size: 16px;
    font-weight: normal;
  }
`;

export default LoggedInUser;

export { LoggedInUser };
