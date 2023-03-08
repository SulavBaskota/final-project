import { Grid, Paper, Stack, Divider } from "@mantine/core";
import { AUCTIONSTATE, ITEMSTATE } from "@component/constants";
import { useStateContext } from "@component/context";
import PlaceBid from "./PlaceBid";
import RevealBid from "./RevealBid";
import Withdraw from "./Withdraw";
import CloseAuction from "./CloseAuction";
import UpdateShippingInfo from "./UpdateShippingInfo";
import CancelAuction from "./CancelAuction";

export default function AuctionInterface({
  auction,
  startTimePassed,
  endTimePassed,
  revealTimePassed,
}) {
  const { address } = useStateContext();

  return (
    <>
      {auction.auctionState === AUCTIONSTATE.UNVERIFIED ? (
        address === auction.seller ? (
          <Grid.Col xs={12} md={4}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Stack align="stretch">
                <CancelAuction auctionId={auction.id} />
              </Stack>
            </Paper>
          </Grid.Col>
        ) : null
      ) : auction.auctionState === AUCTIONSTATE.OPEN ? (
        address === auction.seller ? (
          revealTimePassed ? (
            <Grid.Col xs={12} md={4}>
              <Paper shadow="sm" p="md" radius="md" withBorder>
                <Stack align="stretch">
                  <CloseAuction auctionId={auction.id} />
                </Stack>
              </Paper>
            </Grid.Col>
          ) : null
        ) : startTimePassed ? (
          <Grid.Col xs={12} md={4}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Stack align="stretch">
                {!endTimePassed && <PlaceBid auctionId={auction.id} />}
                {endTimePassed && !revealTimePassed && (
                  <RevealBid auctionId={auction.id} />
                )}
                {revealTimePassed && (
                  <>
                    {auction.bidders.includes(address) && (
                      <>
                        <Withdraw auctionId={auction.id} />
                        <Divider size="lg" />
                      </>
                    )}
                    <CloseAuction auctionId={auction.id} />
                  </>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        ) : null
      ) : auction.auctionState === AUCTIONSTATE.SUCCESSFUL ||
        auction.auctionState === AUCTIONSTATE.FAILED ? (
        auction.bidders.includes(address) ? (
          <Grid.Col xs={12} md={4}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Stack align="stretch">
                <Withdraw auctionId={auction.id} />
                {address === auction.highestBidder &&
                  auction.itemState === ITEMSTATE.RECEIVED && (
                    <>
                      <Divider size="lg" />
                      <UpdateShippingInfo auctionId={auction.id} />
                    </>
                  )}
              </Stack>
            </Paper>
          </Grid.Col>
        ) : null
      ) : null}
    </>
  );
}
