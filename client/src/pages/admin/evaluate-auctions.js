import { Container, Grid, LoadingOverlay } from "@mantine/core";
import { useStateContext } from "@component/context";
import Custom401 from "../401";
import { useEffect, useState } from "react";
import AuctionMediaCard from "@component/components/AuctionMediaCard";
import NoUnverifiedAuctions from "@component/components/NoUnverifiedAuctins";
import { useTimeout } from "@mantine/hooks";

export default function EvaluateAuctions() {
  const { role, getUnverifiedAuctions, toggleIsLoading } = useStateContext();
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
            <Grid justify="space-around" align="center">
              {unVerifiedAuctions.map((auction, index) => (
                <Grid.Col xs={12} md={4} key={index}>
                  <AuctionMediaCard auction={auction} />
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        ) : (
          <NoUnverifiedAuctions />
        )
      ) : (
        <Custom401 />
      )}
    </>
  );
}
