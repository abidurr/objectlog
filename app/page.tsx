import React from "react";
import Image from "next/image";

import { styled } from "styled-components";
import { Header, Container } from "@/components/index";

export default function Home() {
  return (
    <>
      <Header />
      <Container>
        <h1>Home page</h1>
      </Container>
    </>
  );
}
