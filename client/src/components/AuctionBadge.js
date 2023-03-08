import { Badge } from "@mantine/core";
import { AUCTIONSTATE } from "@component/constants";

export default function AuctionBadge({ auctionState, size = "xl" }) {
  return (
    <>
      {auctionState === AUCTIONSTATE.UNVERIFIED ? (
        <Badge color="yellow" size={size}>
          UNVERIFIED
        </Badge>
      ) : auctionState === AUCTIONSTATE.REJECTED ? (
        <Badge color="pink" size={size}>
          REJECTED
        </Badge>
      ) : auctionState === AUCTIONSTATE.OPEN ? (
        <Badge color="teal" size={size}>
          OPEN
        </Badge>
      ) : auctionState === AUCTIONSTATE.SUCCESSFUL ? (
        <Badge color="indigo" size={size}>
          SUCCESSFUL
        </Badge>
      ) : auctionState === AUCTIONSTATE.FAILED ? (
        <Badge color="red" size={size}>
          FAILED
        </Badge>
      ) : null}
    </>
  );
}
