import { Container, Text, Stack, Button, Grid, Center } from "@mantine/core";
import Image from "next/image";
import sorryPic from "/public/sorry.png";
import Link from "next/link";

export default function NoOpenAuctions() {
  return (
    <Container>
      <Grid justify="center" align="center">
        <Grid.Col xs={12} md={6}>
          <Center>
            <Image
              src={sorryPic}
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
              Sorry!!
            </Text>
            <Text fz="lg" fw={500}>
              It seems there are currently
            </Text>
            <Text fz="lg" fw={500}>
              no open auctions on the platform.
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
