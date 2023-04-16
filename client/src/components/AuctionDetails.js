import { Stack, Text, Divider } from "@mantine/core";

export default function AuctionDetails({ auction }) {
  return (
    <Stack>
      <Text fz={30} fw={700}>
        {auction.title}
      </Text>
      <Divider size="lg" />
      <Text fz="lg" tt="capitalize" fw={700} underline>
        Auction Id:
      </Text>
      <Text truncate fw={500}>
        {auction.id}
      </Text>
      <Text truncate >
        Seller: {auction.seller}
      </Text>
      <Text fw={500} color="grape">
        Minimum Bid: {auction.minimumBid} ETH
      </Text>
      <Text color="dimmed">{auction.description}</Text>
      {auction.evaluationMessage && (
        <>
          <Text>Evaluation Message: {auction.evaluationMessage}</Text>
          <Text truncate>Evaluated By: {auction.evaluatedBy}</Text>
          <Text truncate fw={500} color="grape">
            Highest Bidder: {auction.highestBidder}
          </Text>
          <Text fw={500} color="grape">
            Highest Bid: {auction.highestBid} ETH
          </Text>
        </>
      )}
    </Stack>
  );
}
