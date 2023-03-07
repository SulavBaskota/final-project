import { TextInput, Button, Text, Divider } from "@mantine/core";

export default function PlaceBid() {
  return (
    <>
      <Text fz={30} fw={700}>
        Place Bid
      </Text>
      <Divider size="lg" />
      <TextInput
        placeholder="Your deposit in ETH"
        label="Deposit amount"
        type="number"
        withAsterisk
      />
      <TextInput
        placeholder="Your true bid in ETH"
        label="Bid amount"
        type="number"
        withAsterisk
      />
      <TextInput
        placeholder="Your secret pass phrase"
        label="Secret Phrase"
        withAsterisk
        type="password"
      />
      <Button>Submit</Button>
    </>
  );
}
