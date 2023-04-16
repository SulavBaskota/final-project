import { LoadingOverlay, Container, Grid } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { useStateContext } from "@component/context";
import WalletNotConnected from "@component/components/WalletNotConnected";
import NoOpenAuctions from "@component/components/NoOpenAuctions";
import AuctionMediaCard from "@component/components/AuctionMediaCard";
import LearnMoreCardButton from "@component/components/LearnMoreCardButton";

export default function Home() {
  const { address, signer, getOpenAuctions, BAFContract } = useStateContext();
  const [visible, setVisible] = useState(true);
  const { start, clear } = useTimeout(() => setVisible(false), 500);
  const [openAuctions, setOpenAuctions] = useState([]);

  const fetchOpenAuctions = async () => {
    const data = await getOpenAuctions();
    setOpenAuctions(data);
  };

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  useEffect(() => {
    if (signer && address) {
      fetchOpenAuctions();
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionVerified", () => {
        fetchOpenAuctions();
      });
      signedBAFContract.on("AuctionSuccessful", () => {
        fetchOpenAuctions();
      });
      signedBAFContract.on("AuctionFailed", () => {
        fetchOpenAuctions();
      });
    }

    return () =>
      BAFContract.removeAllListeners([
        "AuctionVerified",
        "AuctionSuccessful",
        "AuctionFailed",
      ]);
  }, [address, signer]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {address ? (
        openAuctions.length > 0 ? (
          <Container>
            <Grid justify="center" align="center">
              {openAuctions.map((auction, index) => (
                <Grid.Col xs={12} md={6} lg={4} key={index}>
                  <AuctionMediaCard
                    auction={auction}
                    cardButton={<LearnMoreCardButton auctionId={auction.id} />}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        ) : (
          <NoOpenAuctions />
        )
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
