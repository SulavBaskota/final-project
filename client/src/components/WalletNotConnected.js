import {
  Center,
  Text,
  Stack,
  Grid,
  Button,
  MediaQuery,
  Container,
} from "@mantine/core";
import bidding from "/public/bidding.png";
import Image from "next/image";
import { useStateContext } from "@component/context";

export default function WalletNotConnected() {
  const { connectWallet } = useStateContext();

  return (
    <Container>
      <Grid justify="center" align="center">
        <Grid.Col xs={12} md={6}>
          <Center>
            <Image
              src={bidding}
              height={500}
              width={450}
              priority
              alt="Banner"
            />
          </Center>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Stack align="flex-start">
            <Text fw={800} fz={30}>
              Welcome to
            </Text>
            <Text fw={800} fz={30} tt={"uppercase"}>
              D-Auction
            </Text>
            <Text>Connect your wallet to access the website.</Text>
            <MediaQuery
              smallerThan="md"
              styles={{ display: "flex", alignSelf: "flex-end" }}
            >
              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
                size="xl"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </MediaQuery>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
