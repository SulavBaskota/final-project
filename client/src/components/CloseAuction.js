import { Button, Text } from "@mantine/core";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function CloseAuction({ auctionId }) {
  const { closeAuction, toggleIsLoading, getRevertMessage } = useStateContext();
  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await closeAuction(auctionId);
      txResponse.wait();
      showSuccessNotification("Auction successfully closed");
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
        Close Auction
      </Text>
      <Button onClick={handleClick} color="pink">
        Close
      </Button>
    </>
  );
}
