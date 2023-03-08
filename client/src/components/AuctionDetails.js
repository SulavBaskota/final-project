import { Stack, Text, Divider } from "@mantine/core";

export default function AuctionDetails({ auction }) {
  return (
    <Stack>
      <Text fz={30} fw={700}>
        {auction.title}
      </Text>
      <Divider size="lg" />
      <Text truncate>ID: {auction.id}</Text>
      <Text truncate>Seller: {auction.seller}</Text>
      <Text>Minimum Bid: {auction.minimumBid} ETH</Text>
      <Text>{auction.description}</Text>
      {auction.evaluationMessage && (
        <>
          <Text>Evaluation Message: {auction.evaluationMessage}</Text>
          <Text truncate>Evaluated By: {auction.evaluatedBy}</Text>
          <Text truncate>Highest Bidder: {auction.highestBidder}</Text>
          <Text>Highest Bid: {auction.highestBid} ETH</Text>
        </>
      )}
    </Stack>
  );
}
