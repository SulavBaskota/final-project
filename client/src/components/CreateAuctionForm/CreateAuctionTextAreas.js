import { Textarea } from "@mantine/core";

export default function CreateAuctionTextAreas({
  descrption,
  setDescription,
  returnAddress,
  setReturnAddress,
  error,
}) {
  return (
    <>
      <Textarea
        placeholder="Item Description"
        label="Description"
        minRows={2}
        maxRows={2}
        value={descrption}
        onChange={(e) => setDescription(e.currentTarget.value)}
        error={error?.descrption ? error.descrption : ""}
        withAsterisk
        autoComplete="off"
        mt="md"
      />
      <Textarea
        placeholder="Return Address"
        label="Return Address"
        minRows={2}
        maxRows={2}
        value={returnAddress}
        onChange={(e) => setReturnAddress(e.currentTarget.value)}
        error={error?.returnAddress ? error.returnAddress : ""}
        withAsterisk
        autoComplete="off"
        mt="md"
      />
    </>
  );
}
