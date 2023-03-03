import { Container, Grid, LoadingOverlay, Button } from "@mantine/core";
import { useStateContext } from "@component/context";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useState } from "react";
import AuctionMediaCard from "@component/components/AuctionMediaCard";
import NoUnverifiedAuctions from "@component/components/NoUnverifiedAuctions";
import Unauthorized from "@component/components/Unauthorized";
import EvaluateAuctionModel from "@component/components/EvaluateAuctionModal";

export default function EvaluateAuctions() {
  const { role, getUnverifiedAuctions, BAFContract, signer } =
    useStateContext();
  const [unVerifiedAuctions, setUnverifiedAuctions] = useState([]);
  const [visible, setVisible] = useState(true);
  const [opened, setOpened] = useState(false);
  const [modalData, setModalData] = useState(null);

  const { start, clear } = useTimeout(() => setVisible(false), 500);

  const fetchUnverifiedAuctions = async () => {
    const data = await getUnverifiedAuctions();
    setUnverifiedAuctions(data);
  };

  useEffect(() => {
    if (role && (role === "admin" || role === "super")) {
      fetchUnverifiedAuctions();
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionCreated", (_auctionId) => {
        fetchUnverifiedAuctions();
      });
      signedBAFContract.on("AuctionCancelled", (_auctionId) => {
        fetchUnverifiedAuctions();
      });
    }
    return () =>
      BAFContract.removeAllListeners(["AuctionCreated", "AuctionCancelled"]);
  }, [signer, role]);

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  const CardButton = ({ auction }) => (
    <Button
      variant="light"
      color="blue"
      fullWidth
      mt="md"
      radius="md"
      onClick={() => {
        setOpened(true);
        setModalData(auction);
      }}
    >
      Evaluate
    </Button>
  );

  return (
    <>
      {visible ? (
        <LoadingOverlay visible={visible} overlayBlur={2} />
      ) : role && (role === "admin" || role === "super") ? (
        unVerifiedAuctions.length > 0 ? (
          <Container>
            {opened && (
              <EvaluateAuctionModel
                opened={opened}
                setOpened={setOpened}
                auction={modalData}
              />
            )}
            <Grid justify="center" align="center">
              {unVerifiedAuctions.map((auction, index) => (
                <Grid.Col xs={12} md={6} lg={4} key={index}>
                  <AuctionMediaCard
                    opened={opened}
                    setOpened={setOpened}
                    auction={auction}
                    cardButton={<CardButton auction={auction} />}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        ) : (
          <NoUnverifiedAuctions />
        )
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
