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
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useTimeout } from "@mantine/hooks";
import AuctionBadge from "@component/components/AuctionBadge";
import AuctionDetails from "@component/components/AuctionDetails";
import Timers from "@component/components/Timers";
import AuctionInterface from "@component/components/AuctionInterface";
import WalletNotConnected from "@component/components/WalletNotConnected";

export default function Auction() {
  const router = useRouter();
  const { auctionId } = router.query;
  const {
    address,
    getBlindAuctionById,
    downloadFromIpfs,
    BAFContract,
    signer,
  } = useStateContext();
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
    if (signer && address && auctionId) {
      fetchBlindAuction();
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionCancelled", (_auctionId) => {
        if (auctionId === _auctionId) fetchBlindAuction();
      });
      signedBAFContract.on(
        "AuctionVerified",
        (_auctionId, _evaluatedBy, _evaluationMessage) => {
          if (auctionId === _auctionId) fetchBlindAuction();
        }
      );
      signedBAFContract.on(
        "AuctionRejected",
        (_auctionId, _evaluatedBy, _evaluationMessage) => {
          if (auctionId === _auctionId) fetchBlindAuction();
        }
      );
      signedBAFContract.on(
        "AuctionSuccessful",
        (_auctionId, _highestBidder, _highestBid) => {
          if (auctionId === _auctionId) fetchBlindAuction();
        }
      );
      signedBAFContract.on("AuctionFailed", (_auctionId) => {
        if (auctionId === _auctionId) fetchBlindAuction();
      });
      signedBAFContract.on("BidPlaced", (_auctionId, _bidder) => {
        if (auctionId === _auctionId) fetchBlindAuction();
      });
      signedBAFContract.on("BidRevealed", (_auctionId, _bidder) => {
        if (auctionId === _auctionId) fetchBlindAuction();
      });
      signedBAFContract.on("ShipmentStatusUpdated", (_auctionId) => {
        if (auctionId === _auctionId) fetchBlindAuction();
      });
    }
    return () =>
      BAFContract.removeAllListeners([
        "AuctionCancelled",
        "AuctionVerified",
        "AuctionRejected",
        "AuctionSuccessful",
        "AuctionFailed",
        "BidPlaced",
        "BidRevealed",
        "ShipmentStatusUpdated",
      ]);
  }, [address, auctionId, signer]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {address ? (
        auction && (
          <Container>
            <Grid>
              <Grid.Col xs={12} md={8}>
                {images.length > 0 && (
                  <Carousel loop withIndicators>
                    {images.map((image, index) => (
                      <Carousel.Slide key={index}>
                        <Image
                          src={image}
                          alt={`${auction.id}-image-${index}`}
                          height={500}
                        />
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                )}
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
            </Grid>
          </Container>
        )
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
