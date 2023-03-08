import { Textarea, Button } from "@mantine/core";
import { useState } from "react";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function UpdateShippingInfo({ auctionId }) {
  const [shippingAddress, setShippingAddress] = useState("");

  const { updateShippingInfo, toggleIsLoading, getRevertMessage } =
    useStateContext();
  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await updateShippingInfo(auctionId, shippingAddress);
      txResponse.wait();
      setShippingAddress("");
      showSuccessNotification("Shipping address updated");
    } catch (e) {
      const revertMessage = getRevertMessage(e);
      showErrorNotification(revertMessage);
    } finally {
      toggleIsLoading();
    }
  };

  return (
    <>
      <Textarea
        label="Shipping Address"
        placeholder="Your Shipping Address"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.currentTarget.value)}
        withAsterisk
      />
      <Button onClick={handleClick}>Submit</Button>
    </>
  );
}
