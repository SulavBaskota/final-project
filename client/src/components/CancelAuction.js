import { Text, Button } from "@mantine/core";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function CancelAuction({ auctionId }) {
  const { cancelAuction, toggleIsLoading, getRevertMessage } =
    useStateContext();

  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await cancelAuction(auctionId);
      txResponse.wait();
      showSuccessNotification("Auction successfully cancelled");
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
        Cancel Auction
      </Text>
      <Button color="pink" onClick={handleClick}>
        Cancel Auction
      </Button>
    </>
  );
}
