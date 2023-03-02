import { useState } from "react";
import { Container, Grid, Button, Center, Paper } from "@mantine/core";
import deliveryPic from "public/delivery.png";
import AuctionProcessStepper from "@component/components/AuctionProcessStepper";
import CreateAuctionForm from "@component/components/CreateAuctionForm";
import Image from "next/image";
import ShippingDetails from "@component/components/ShippingDetails";
import WalletNotConnected from "@component/components/WalletNotConnected";
import { useStateContext } from "@component/context";

export default function CreateAuction() {
  const [opened, setOpened] = useState(false);
  const { address } = useStateContext();

  const CreateAuctionButton = () => (
    <Button
      variant="gradient"
      gradient={{ from: "teal", to: "blue", deg: 60 }}
      size="xl"
      onClick={() => setOpened(true)}
    >
      Create Auction
    </Button>
  );

  return (
    <>
      {address ? (
        <Container>
          <CreateAuctionForm opened={opened} setOpened={setOpened} />
          <Grid>
            <Grid.Col xs={12} md={6}>
              <Center>
                <AuctionProcessStepper />
              </Center>
            </Grid.Col>
            <Grid.Col xs={12} md={6}>
              <Center>
                <Image
                  src={deliveryPic}
                  height={400}
                  width={400}
                  alt="shipping-image"
                  priority
                />
              </Center>
            </Grid.Col>
            <Grid.Col xs={12}>
              <Paper shadow="sm" p="xl">
                <Grid justify="center" align="flex-start">
                  <Grid.Col xs={12} sm={6}>
                    <Center>
                      <ShippingDetails />
                    </Center>
                  </Grid.Col>
                  <Grid.Col xs={12} sm={6}>
                    <Center>
                      <CreateAuctionButton />
                    </Center>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
