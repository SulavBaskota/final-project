import { Badge } from "@mantine/core";
import { AUCTIONSTATE } from "@component/constants";

export default function AuctionBadge({ auctionState }) {
  return (
    <>
      {auctionState === AUCTIONSTATE.UNVERIFIED ? (
        <Badge color="yellow" size="xl">
          UNVERIFIED
        </Badge>
      ) : auctionState === AUCTIONSTATE.REJECTED ? (
        <Badge color="pink" size="xl">
          REJECTED
        </Badge>
      ) : auctionState === AUCTIONSTATE.OPEN ? (
        <Badge color="teal" size="xl">
          OPEN
        </Badge>
      ) : auctionState === AUCTIONSTATE.SUCCESSFUL ? (
        <Badge color="indigo" size="xl">
          SUCCESSFUL
        </Badge>
      ) : auctionState === AUCTIONSTATE.FAILED ? (
        <Badge color="red" size="xl">
          FAILED
        </Badge>
      ) : null}
    </>
  );
}
