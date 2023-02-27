import { useState } from "react";
import {
  Container,
  Stepper,
  Grid,
  Text,
  Button,
  Box,
  Center,
  Group,
  Stack,
  Paper,
} from "@mantine/core";
import { STEPPER_LIST } from "@component/constants/stepper";
import { SHIPPING_DETAILS } from "@component/constants/shippingDetails";
import deliveryPic from "public/delivery.png";
import CreateAuctionForm from "@component/components/CreateAuctionForm";
import Image from "next/image";

export default function CreateAuction() {
  const [opened, setOpened] = useState(false);
  return (
    <Container>
      <CreateAuctionForm opened={opened} setOpened={setOpened} />
      <Grid>
        <Grid.Col xs={12} md={6}>
          <Center>
            <Stack>
              <Text fz="xl">Auction Registration Process</Text>
              <Stepper orientation="vertical" active={STEPPER_LIST.length}>
                {STEPPER_LIST.map((item, index) => (
                  <Stepper.Step
                    key={index}
                    label={`Step ${index + 1}`}
                    description={item}
                    completedIcon={index + 1}
                  />
                ))}
              </Stepper>
            </Stack>
          </Center>
        </Grid.Col>
        <Grid.Col xs={12} md={6}>
          <Center>
            <Image src={deliveryPic} height={400} width={400} />
          </Center>
        </Grid.Col>
        <Grid.Col xs={12}>
          <Paper shadow="sm" p="xl">
            <Grid justify="center" align="flex-start">
              <Grid.Col xs={12} sm={6}>
                <Center>
                  <Box>
                    <Text fz="xl">Auction Item Shipping Details:</Text>
                    {SHIPPING_DETAILS.map((item, index) => (
                      <Text fz="md" key={index}>
                        {item}
                      </Text>
                    ))}

                    <Text fz="md" fs="italic">
                      <span style={{ color: "red" }}>*</span>Please use auction
                      address as sender name
                    </Text>
                  </Box>
                </Center>
              </Grid.Col>
              <Grid.Col xs={12} sm={6}>
                <Center>
                  <Button
                    variant="gradient"
                    gradient={{ from: "teal", to: "blue", deg: 60 }}
                    size="xl"
                    onClick={() => setOpened(true)}
                  >
                    Create Auction
                  </Button>
                </Center>
              </Grid.Col>
            </Grid>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
