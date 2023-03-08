import { FileInput } from "@mantine/core";

export default function CreateAuctionImageUpload({ images, setImages }) {
  return (
    <FileInput
      label="Item Images"
      placeholder="Upload files"
      multiple
      accept="image/*"
      withAsterisk
      value={images}
      onChange={setImages}
      autoComplete="off"
      mt="md"
    />
  );
}
