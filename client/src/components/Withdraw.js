import { Button, Text } from "@mantine/core";
import { useStateContext } from "@component/context";

export default function Withdraw({ auctionId }) {
  const { withdraw, toggleIsLoading } = useStateContext();
  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await withdraw(auctionId);
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
        Withdraw Bid
      </Text>
      <Button onClick={handleClick}>Withdraw</Button>
    </>
  );
}
