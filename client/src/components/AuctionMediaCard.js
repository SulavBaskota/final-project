import { Card, Image, Text, Stack, Group, Box } from "@mantine/core";
import { useStateContext } from "@component/context";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

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
    <>
      {images.length > 0 ? (
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

          <Text weight={500} mt="md" mb="xs">
            {auction.title}
          </Text>

          <Group position="apart">
            <Stack spacing={0}>
              <Text size="sm" color="teal">
                Start Time
              </Text>
              <Text size="sm" color="dimmed">
                {dayjs.unix(auction.startTime).format("DD/MM/YY, HH:mm")}
              </Text>
            </Stack>
            <Stack spacing={0} align="flex-end">
              <Text size="sm" color="orange">
                End Time
              </Text>
              <Text size="sm" color="dimmed">
                {dayjs.unix(auction.endTime).format("DD/MM/YY, HH:mm")}
              </Text>
            </Stack>
          </Group>

          <Box sx={{ height: 100 }}>
            <Text size="sm" color="dimmed" mt="md" lineClamp={4}>
              {auction.description}
            </Text>
          </Box>
          {cardButton}
        </Card>
      ) : null}
    </>
  );
}
