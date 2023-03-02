import { FileInput } from "@mantine/core";

export default function CreateAuctionImageUpload({ images, setImages, error }) {
  return (
    <FileInput
      label="Item Images"
      placeholder="Upload files"
      multiple
      accept="image/*"
      withAsterisk
      value={images}
      onChange={setImages}
      error={error?.images ? error.images : ""}
      autoComplete="off"
      mt="md"
    />
  );
}
