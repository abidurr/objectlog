import { Suspense } from "react";
import { Header, Container, UserNavigation } from "@/components";
import { theme } from "@/components/theme";

export default function Motivation() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <UserNavigation />
      </Suspense>
      <Container>
        <h1>About</h1>
        <p>
          This is a web application designed to manage customized object
          records.
        </p>
        <p>
          This Next app was developed by{" "}
          <a
            href="https://abidur.dev"
            style={{ color: `${theme.PRIMARY_500}` }}
            target="_blank"
            rel="noopener noreferrer"
          >
            abidur.dev
          </a>
        </p>
        <p>
          Check out my GitHub at{" "}
          <a
            href="https://github.com/abidurr"
            style={{ color: `${theme.PRIMARY_500}` }}
            target="_blank"
            rel="noopener noreferrer"
          >
            @abidurr
          </a>
        </p>
      </Container>
    </>
  );
}
