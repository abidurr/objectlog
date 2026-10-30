import React from "react";
import Image from "next/image";
import Link from "next/link";
import { styled } from "styled-components";
import { Suspense } from "react";
import { Header, Container, Login } from "@/components/index";
import { theme } from "../components/theme";

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <h1>ObjectLog</h1>
        <h3>Objects & Logs. Everything you need to manage your data.</h3>
        <StyledPara>
          Everyone needs a different solution for the things they want to
          remember. It could be books, shows, people, events, or whatever. All
          you need is to decide what you want to remember. Create an{" "}
          <Link href="/objects">object</Link> for anything you want and give it
          any{" "}
          <Link href="/fields" style={{ color: `${theme.PRIMARY_500}` }}>
            fields
          </Link>{" "}
          you want. Then add all the items you want to remember. It really can
          be as simple as that.
        </StyledPara>
      </Container>
    </>
  );
}

const StyledPara = styled.p`
  text-align: justify;
  a {
    color: ${theme.PRIMARY_500};
    text-decoration: none;
  }
  a:visited {
    color: ${theme.PRIMARY_500};
  }
  a:hover {
    color: ${theme.PRIMARY_200};
    text-decoration: underline;
  }
`;
