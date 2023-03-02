import { TextInput } from "@mantine/core";

export default function CreateAuctionTextInputs({
  title,
  setTitle,
  minimumBid,
  setMinimumBid,
  error,
}) {
  return (
    <>
      <TextInput
        label="Title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        autoComplete="off"
        withAsterisk
        error={error?.title ? error.title : ""}
      />
      <TextInput
        label="Minimum Bid"
        type="number"
        placeholder="Minimum Bid in ETH"
        value={minimumBid}
        onChange={(e) => setMinimumBid(e.currentTarget.value)}
        withAsterisk
        autoComplete="off"
        mt="md"
      />
    </>
  );
}
