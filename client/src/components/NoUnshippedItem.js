import { Center, Container, Grid, Stack, Text } from "@mantine/core";
import Image from "next/image";
import taskDonePic from "public/task-done.png";

export default function NoUnshippedItem() {
  return (
    <Container>
      <Grid justify="center" align="center">
        <Grid.Col xs={12} md={6}>
          <Center>
            <Image
              src={taskDonePic}
              height={400}
              width={400}
              alt="task-done-pic"
              priority
            />
          </Center>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Stack align="center">
            <Text fw={800} fz={30} color="green">
              Well done!!
            </Text>
            <Text fz="lg" fw={500}>
              No more items left to ship.
            </Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
