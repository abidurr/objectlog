import { Container, Header } from "@/components/";
import Image from "next/image";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import { Suspense } from "react";
import { ObjectsList } from "./ObjectsList";
import { Login } from "@/components/Login";
import { auth0 } from "@/lib/auth0";
import { getObjects, createObject } from "@/app/actions";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "../../components/";

const HOVER_TAB_COLOR = theme.PRIMARY_600;

async function ObjectsContent() {
  const session = await auth0.getSession();

  const userEmail = session?.user?.email ?? ""; // "admin@test.com";
  const objects = await getObjects(`${userEmail}`?.toLowerCase());

  const createNewObject = async (inputName: string) => {
    return await createObject({
      userId: session.user.id,
      email: ession?.user?.email,
      input: { name: inputName, fields: [] },
    });
  };

  if (!session) {
    return (
      <>
        <Suspense fallback={<p>Loading user state...</p>}>
          <Login />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <UserNav>
        {session?.user && (
          <ul>
            {/* <li>
              <Link href="/">Home</Link>
            </li> */}
            <li>
              <UserInfoSection>
                <Image
                  src={session?.user?.picture}
                  alt="user logo"
                  width={32}
                  height={32}
                />
                <Link href="/objects">{session?.user?.name}</Link>
              </UserInfoSection>
            </li>
          </ul>
        )}
      </UserNav>
      <ObjectsList objects={objects} />
      <h3>Create new object</h3>
      <p>Name</p>
      <input
        value={objectName}
        onChange={(e) => setObjectName(e.target.value)}
      />
      <button onClick={() => createNewObject()} />
    </>
  );
}

export default async function Objects() {
  return (
    <>
      <Header />
      <Container>
        <h1>Objects</h1>
        <Suspense fallback={<p>Loading user objects...</p>}>
          <ObjectsContent />
        </Suspense>
      </Container>
    </>
  );
}

const UserInfoSection = styled.div`
  display: flex;
  padding: 8px 20px;
  img {
    border-radius: 50%;
    margin: 6px 8px 0px 0px;
  }
`;

const UserNav = styled.div`
  /* background-color: rgb(10, 153, 3); */
  width: fit-content;
  position: absolute;
  /* box-shadow: 2px 2px 5px rgba(200, 200, 200, 0.7); */
  z-index: 3;
  font-size: 12px;
  bottom: 24px;
  right: 24px;
  font-size: 1em;
  border-radius: 16px;
  margin: 0px auto;

  ul {
    /* display: inline-block; */
    width: 100%;
    min-width: 120px;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    background-color: rgba(5, 150, 3, 0.4);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    width: fit-content;
    align-items: center;
    justify-content: center;
    /* margin: 0px auto; */
  }

  ul a {
    width: 100%;
    color: ${theme.PRIMARY_200};
    display: block;
    /* outline: 1px solid rgba(10, 150, 0, 0.4); */
    padding: 12px 0px;
    border-right: gray;
    text-decoration: none;
    text-align: center;
  }
  li {
    /* display: inline-block; */

    width: 100%;
  }
  li:hover {
    background-color: ${HOVER_TAB_COLOR};
    opacity: 0.65;
    transition: ease-out 300ms;
  }
  /* li:first-child {
    border-radius: 16px 0 0 16px;
  }

  li:last-child {
    border-radius: 0 16px 16px 0;
  } */
  ul:hover {
    /* color: rgba(10, 150, 0, 0.6);
    transition: ease-in 400ms; */
  }
  a:active {
    background-color: rgba(10, 150, 0, 0.6);
    transition: ease-in 400ms;
  }

  @media (max-width: 800px) {
    ul {
      flex-direction: column;
      width: 100%;
    }
    li {
      width: 100%;
    }
    li:first-child {
      border-radius: 16px 16px 0 0;
    }
    li:last-child {
      border-radius: 0 0 16px 16px;
    }
  }
`;
