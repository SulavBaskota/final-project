import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useStateContext } from "@component/context";
import {
  Container,
  Stack,
  Image,
  Grid,
  Paper,
  Divider,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useTimeout } from "@mantine/hooks";
import AuctionBadge from "@component/components/AuctionBadge";
import AuctionDetails from "@component/components/AuctionDetails";
import Timers from "@component/components/Timers";
import AuctionInterface from "@component/components/AuctionInterface";

export default function Auction() {
  const router = useRouter();
  const { auctionId } = router.query;
  const { address, getBlindAuctionById, downloadFromIpfs } = useStateContext();
  const [auction, setAuction] = useState({});
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(true);
  const [startTimePassed, setStartTimePassed] = useState(false);
  const [endTimePassed, setEndTimePassed] = useState(false);
  const [revealTimePassed, setRevealTimePassed] = useState(false);
  const { start, clear } = useTimeout(() => setVisible(false), 500);

  const fetchBlindAuction = async () => {
    const data = await getBlindAuctionById(auctionId);
    const imageData = await downloadFromIpfs(data.cid);
    setAuction(data);
    setImages(imageData);
  };

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  useEffect(() => {
    if (address && auctionId) fetchBlindAuction();
  }, [address, auctionId]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {auction && images.length > 0 && (
        <Container>
          <Grid>
            <Grid.Col xs={12} md={8}>
              <Carousel loop withIndicators>
                {images.map((image, index) => (
                  <Carousel.Slide key={index}>
                    <Image src={image} alt={`${auction.id}-image-${index}`} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Grid.Col>
            <Grid.Col xs={12} md={4}>
              <Stack>
                <Paper shadow="sm" p="md" radius="md" withBorder>
                  <Stack>
                    <AuctionBadge auctionState={auction.auctionState} />
                    <Divider size="md" />
                    <Timers
                      auctionState={auction.auctionState}
                      startTime={auction.startTime}
                      endTime={auction.endTime}
                      revealTime={auction.revealTime}
                      startTimePassed={startTimePassed}
                      setStartTimePassed={setStartTimePassed}
                      endTimePassed={endTimePassed}
                      setEndTimePassed={setEndTimePassed}
                      revealTimePassed={revealTimePassed}
                      setRevealTimePassed={setRevealTimePassed}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
            <Grid.Col xs={12}>
              <Grid>
                <Grid.Col xs={12} md={8}>
                  <Paper shadow="sm" p="md" radius="md" withBorder>
                    <AuctionDetails auction={auction} />
                  </Paper>
                </Grid.Col>
                <AuctionInterface
                  auction={auction}
                  startTimePassed={startTimePassed}
                  endTimePassed={endTimePassed}
                  revealTimePassed={revealTimePassed}
                />
              </Grid>
            </Grid.Col>
            <Grid.Col>
              {auction.bidders.map((bidder, index) => (
                <Text key={index}>{bidder}</Text>
              ))}
            </Grid.Col>
          </Grid>
        </Container>
      )}
    </>
  );
}
