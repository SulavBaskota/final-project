import { Button, Text } from "@mantine/core";
import { useStateContext } from "@component/context";

export default function CloseAuction({ auctionId }) {
  const { closeAuction, toggleIsLoading } = useStateContext();
  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await closeAuction(auctionId);
      txResponse.wait();
      console.log(txResponse);
    } catch (e) {
      console.log(e);
    } finally {
      toggleIsLoading();
    }
  };
  return (
    <>
      <Text fz={30} fw={700} align="center">
        Close Auction
      </Text>
      <Button onClick={handleClick} color="pink">
        Close Auction
      </Button>
    </>
  );
}
