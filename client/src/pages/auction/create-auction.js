import { useState } from "react";
import { Container, TextInput, Stack } from "@mantine/core";
import { ThemeContext } from "@emotion/react";

export default function CreateAuction() {
  return (
    <Container>
      <Stack>
        <TextInput label="Title" placeholder="Title" withAsterisk />
      </Stack>
    </Container>
  );
}
