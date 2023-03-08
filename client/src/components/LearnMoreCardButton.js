import { Button } from "@mantine/core";
import Link from "next/link";

export default function LearnMoreCardButton({ auctionId }) {
  return (
    <Button
      variant="light"
      color="blue"
      fullWidth
      mt="md"
      radius="md"
      component={Link}
      href={`/auction/${encodeURIComponent(auctionId)}`}
    >
      Learn More
    </Button>
  );
}
