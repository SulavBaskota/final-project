import { Card, Text, Group, Box, Button } from "@mantine/core";
import { useStateContext } from "@component/context";
import { useEffect, useState } from "react";
import AuctionBadge from "./AuctionBadge";
import { AUCTIONSTATE } from "@component/constants";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function ShipmentMediaCard({ auction }) {
  const {
    getShippingAddress,
    toggleIsLoading,
    getRevertMessage,
    updateShipmentStatus,
  } = useStateContext();
  const [shippingAddress, setShippingAddress] = useState("");

  const fetchShipmentData = async () => {
    const data = await getShippingAddress(auction.id);
    setShippingAddress(data);
  };

  useEffect(() => {
    fetchShipmentData();
  }, [auction]);

  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await updateShipmentStatus(auction.id);
      txResponse.wait();
      showSuccessNotification("Shipment status updated");
    } catch (e) {
      const revertMessage = getRevertMessage(e);
      showErrorNotification(revertMessage);
    } finally {
      toggleIsLoading();
    }
  };

  const CardButton = () => (
    <Button color="blue" mt="md" onClick={handleClick}>
      Marked Shipped
    </Button>
  );

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      sx={{ minWidth: 250 }}
    >
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{auction.title}</Text>
        <AuctionBadge auctionState={auction.auctionState} size="lg" />
      </Group>
      <Text truncate>ID: {auction.id}</Text>
      <Text truncate>
        Receiver ID:{" "}
        {auction.auctionState === AUCTIONSTATE.SUCCESSFUL
          ? auction.highestBidder
          : auction.seller}
      </Text>
      <Box sx={{ height: 50 }}>
        <Text size="sm" mt="md" lineClamp={3} fw={500}>
          Shipping Address: {shippingAddress}
        </Text>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CardButton />
      </Box>
    </Card>
  );
}
