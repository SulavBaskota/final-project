import { TextInput, Button, Text, Divider } from "@mantine/core";
import { useState } from "react";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";

export default function PlaceBid({ auctionId }) {
  const [deposit, setDeposit] = useState(0);
  const [trueBid, setTrueBid] = useState(0);
  const [secret, setSecret] = useState("");
  const { placeBid, toggleIsLoading, getRevertMessage } = useStateContext();

  const resetStates = () => {
    setDeposit(0);
    setTrueBid(0);
    setSecret("");
  };

  const handleClick = async () => {
    if (secret === "") {
      showErrorNotification("Secret cannot be empty");
      return;
    }
    try {
      toggleIsLoading();
      const txResponse = await placeBid(auctionId, deposit, trueBid, secret);
      txResponse.wait();
      resetStates();
      showSuccessNotification("Bid successfully placed");
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
        Place Bid
      </Text>
      <Divider size="lg" />
      <TextInput
        placeholder="Your deposit in ETH"
        label="Deposit amount"
        type="number"
        value={deposit}
        onChange={(e) => setDeposit(e.currentTarget.value)}
        withAsterisk
      />
      <TextInput
        placeholder="Your true bid in ETH"
        label="Bid amount"
        type="number"
        value={trueBid}
        onChange={(e) => setTrueBid(e.currentTarget.value)}
        withAsterisk
      />
      <TextInput
        placeholder="Your secret pass phrase"
        label="Secret Phrase"
        withAsterisk
        value={secret}
        onChange={(e) => setSecret(e.currentTarget.value)}
        type="password"
      />
      <Button onClick={handleClick}>Submit</Button>
    </>
  );
}
