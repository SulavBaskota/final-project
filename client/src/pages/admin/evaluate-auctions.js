import { Container, Grid, LoadingOverlay } from "@mantine/core";
import { useStateContext } from "@component/context";
import Unauthorized from "../../components/Unauthorized";
import { useEffect, useState } from "react";
import AuctionMediaCard from "@component/components/AuctionMediaCard";
import NoUnverifiedAuctions from "@component/components/NoUnverifiedAuctions";
import { useTimeout } from "@mantine/hooks";

export default function EvaluateAuctions() {
  const { role, getUnverifiedAuctions, BAFContract, signer } =
    useStateContext();
  const [unVerifiedAuctions, setUnverifiedAuctions] = useState([]);
  const [visible, setVisible] = useState(true);

  const { start, clear } = useTimeout(() => setVisible(false), 500);

  const fetchUnverifiedAuctions = async () => {
    const data = await getUnverifiedAuctions();
    setUnverifiedAuctions(data);
  };

  useEffect(() => {
    if (role && (role === "admin" || role === "super"))
      fetchUnverifiedAuctions();
  }, [role]);

  useEffect(() => {
    if (signer) {
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionCreated", (_auctionId) => {
        fetchUnverifiedAuctions();
      });
      signedBAFContract.on("AuctionCancelled", (_auctionId) => {
        fetchUnverifiedAuctions();
      });
    }
  }, [signer]);
 
  useEffect(() => {
    start();
    return () => clear();
  }, []);

  return (
    <>
      {visible ? (
        <LoadingOverlay visible={visible} overlayBlur={2} />
      ) : role && (role === "admin" || role === "super") ? (
        unVerifiedAuctions.length > 0 ? (
          <Container>
            <Grid justify="center" align="center">
              {unVerifiedAuctions.map((auction, index) => (
                <Grid.Col xs={12} md={6} lg={4} key={index}>
                  <AuctionMediaCard auction={auction} />
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
