import { Container } from "@chakra-ui/react";
import { VoterRegTable } from "./VoterRegTable";

export default async function Page() {
  return (
    <main>
      <Container maxW="l">
        <VoterRegTable />
      </Container>
    </main>
  );
}
