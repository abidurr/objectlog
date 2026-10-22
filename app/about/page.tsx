import { Header, Container } from "@/components";
import Image from "next/image";

export default function Motivation() {
  return (
    <>
      <Header />
      <Container>
        <h1>About</h1>
        <p>
          This Next app was developed by{" "}
          <a
            href="https://abidur.dev"
            style={{ color: "lightgreen" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            abidur.dev
          </a>
          .
        </p>
        <p>
          Check out my GitHub at{" "}
          <a
            href="https://github.com/abidurr"
            style={{ color: "lightgreen" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            @abidurr
          </a>
          .
        </p>
      </Container>
    </>
  );
}
