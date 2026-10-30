import { Header, Container } from "@/components";
import Image from "next/image";

export default function Documentation() {
  return (
    <>
      <Header />
      <Container>
        <h1>Doc page</h1>
        <p>Make the objects you want</p>
        <p>Add fields to each object</p>
        <p>Add records for each object</p>
        <p>Add the fields for each record</p>
        <p>Use views to see all your data</p>
        <p></p>
      </Container>
    </>
  );
}
