import { Container, Header } from "@/components/";
import Image from "next/image";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "@/components/atoms";
import { Suspense } from "react";
import { ObjectsList } from "./ObjectsList";
import { Login } from "@/components/Login";

export default function Objects() {
  return (
    <>
      <Header />
      <Container>
        <h1>Objects</h1>
        <Suspense fallback={<p>Loading...</p>}>
          <Login />
          <ObjectsList />
        </Suspense>
      </Container>
    </>
  );
}
