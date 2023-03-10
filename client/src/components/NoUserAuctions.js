import { Container, Text, Stack, Button, Grid, Center } from "@mantine/core";
import Image from "next/image";
import oopsPic from "/public/oops.png";
import Link from "next/link";

export default function NoUserAuctions() {
  return (
    <Container>
      <Grid justify="center" align="center">
        <Grid.Col xs={12} md={6}>
          <Center>
            <Image
              src={oopsPic}
              height={400}
              width={400}
              alt="sorry-pic"
              priority
            />
          </Center>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Stack align="center">
            <Text fw={800} fz={30} color="pink">
              Oops!!
            </Text>
            <Text fz="lg" fw={500}>
              It seems that you don't
            </Text>
            <Text fz="lg" fw={500}>
              have any bookmarks yet.
            </Text>
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 60 }}
              size="xl"
              component={Link}
              href="/auction/create-auction"
            >
              Create Auction
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
