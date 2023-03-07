import { TextInput, Button, Text, Divider } from "@mantine/core";
import { useState } from "react";
import { useStateContext } from "@component/context";

export default function RevealBid({ auctionId }) {
  const [trueBid, setTrueBid] = useState(0);
  const [secret, setSecret] = useState("");
  const { revealBid, toggleIsLoading } = useStateContext();

  const handleClick = async () => {
    try {
      toggleIsLoading();
      const txResponse = await revealBid(auctionId, trueBid, secret);
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
        Reveal Bid
      </Text>
      <Divider size="lg" />
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
