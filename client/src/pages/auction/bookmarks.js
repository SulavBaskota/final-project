import { useEffect, useState } from "react";
import { useStateContext } from "@component/context";
import { useTimeout } from "@mantine/hooks";
import { Container, LoadingOverlay, Grid } from "@mantine/core";
import WalletNotConnected from "@component/components/WalletNotConnected";
import NoUserAuctions from "@component/components/NoUserAuctions";
import LearnMoreCardButton from "@component/components/LearnMoreCardButton";
import AuctionMediaCard from "@component/components/AuctionMediaCard";

export default function Bookmarks() {
  const { address, getUserAuctions } = useStateContext();
  const [visible, setVisible] = useState(true);
  const [userAuctions, setUserAuctions] = useState([]);
  const { start, clear } = useTimeout(() => setVisible(false), 500);

  const fetchUserAuctions = async () => {
    const data = await getUserAuctions();
    setUserAuctions(data);
  };

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  useEffect(() => {
    if (address) fetchUserAuctions();
  }, [address]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {address ? (
        userAuctions.length > 0 ? (
          <Container>
            <Grid justify="center" align="center">
              {userAuctions.map((auction, index) => (
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
          <NoUserAuctions />
        )
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
