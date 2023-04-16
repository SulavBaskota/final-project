import { useState, useEffect } from "react";
import { Container, LoadingOverlay, Grid } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { useStateContext } from "@component/context";
import WalletNotConnected from "@component/components/WalletNotConnected";
import NoClosedAuctions from "@component/components/NoClosedAuctions";
import AuctionMediaCard from "@component/components/AuctionMediaCard";
import LearnMoreCardButton from "@component/components/LearnMoreCardButton";

export default function ClosedAuctions() {
  const [visible, setVisible] = useState(true);
  const [closedAuctions, setClosedAuctions] = useState([]);
  const { start, clear } = useTimeout(() => setVisible(false), 500);
  const { address, signer, BAFContract, getClosedAuctions } = useStateContext();

  const fetchClosedAuctions = async () => {
    const data = await getClosedAuctions();
    setClosedAuctions(data);
  };

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  useEffect(() => {
    if (signer && address) {
      fetchClosedAuctions();
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionCancelled", () => {
        fetchClosedAuctions();
      });
      signedBAFContract.on("AuctionRejected", () => {
        fetchClosedAuctions();
      });
      signedBAFContract.on("AuctionVerified", () => {
        fetchClosedAuctions();
      });
      signedBAFContract.on("AuctionSuccessful", () => {
        fetchClosedAuctions();
      });
      signedBAFContract.on("AuctionFailed", () => {
        fetchClosedAuctions();
      });
    }

    return () =>
      BAFContract.removeAllListeners([
        "AuctionCancelled",
        "AuctionRejected",
        "AuctionVerified",
        "AuctionSuccessful",
        "AuctionFailed",
      ]);
  }, [address, signer]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {address ? (
        closedAuctions.length > 0 ? (
          <Container>
            <Grid justify="center" align="center">
              {closedAuctions.map((auction, index) => (
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
          <NoClosedAuctions />
        )
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
