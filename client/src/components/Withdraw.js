import { Button, Text } from "@mantine/core";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function Withdraw({ auctionId }) {
  const { withdraw, toggleIsLoading, getRevertMessage } = useStateContext();
  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await withdraw(auctionId);
      txResponse.wait();
      showSuccessNotification("Withdraw successful");
    } catch (e) {
      const revertMessage = getRevertMessage(e);
      showErrorNotification(revertMessage);
    } finally {
      toggleIsLoading();
    }
  };
  return (
    <>
      <Text fz={30} fw={700} align="center">
        Withdraw
      </Text>
      <Button onClick={handleClick}>Withdraw</Button>
    </>
  );
}
