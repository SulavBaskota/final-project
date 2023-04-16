import { Card, Image, Text, Group, Box } from "@mantine/core";
import { useStateContext } from "@component/context";
import { useEffect, useState } from "react";
import AuctionTimingDetails from "./AuctionTimingDetails";
import AuctionBadge from "./AuctionBadge";

export default function AuctionMediaCard({ auction, cardButton }) {
  const { downloadFromIpfs } = useStateContext();
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    const data = await downloadFromIpfs(auction.cid);
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      sx={{ minWidth: 250 }}
    >
      <Card.Section>
        <Image src={images[0]} height={200} alt="Item Image" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{auction.title}</Text>
        <AuctionBadge auctionState={auction.auctionState} size="sm" />
      </Group>

      <AuctionTimingDetails
        startTime={auction.startTime}
        endTime={auction.endTime}
      />

      <Box sx={{ height: 100 }}>
        <Text size="sm" color="dimmed" mt="md" lineClamp={4}>
          {auction.description}
        </Text>
      </Box>
      {cardButton}
    </Card>
  );
}
