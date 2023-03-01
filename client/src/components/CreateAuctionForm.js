import { useState } from "react";
import {
  TextInput,
  Button,
  Box,
  Modal,
  SimpleGrid,
  Textarea,
  FileInput,
  Text,
} from "@mantine/core";
import { calculateDateInUnix } from "@component/utils";
import DateTimePicker from "./DateTimePicker";
import { useStateContext } from "@component/context";

export default function CreateAuctionForm({ opened, setOpened }) {
  const [title, setTitle] = useState("");
  const [minimumBid, setMinimumBid] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [images, setImages] = useState([]);
  const [descrption, setDescription] = useState("");
  const [returnAddress, setReturnAddress] = useState("");

  const { createAuction, uploadToIpfs, toggleIsLoading } = useStateContext();

  const handleClose = () => {
    setOpened(false);
  };

  const handleSubmit = async () => {
    toggleIsLoading();
    const auctionStartTime = calculateDateInUnix(startDate, startTime);
    const auctionEndTime = calculateDateInUnix(endDate, endTime);
    // const cid = await uploadToIpfs(images);
    // console.log(cid);
    const params = {
      _title: title,
      _startTime: auctionStartTime,
      _endTime: auctionEndTime,
      _minimumBid: minimumBid,
      _cid: "https://gateway.ipfscdn.io/ipfs/QmSdn7fERhNW76YTZcCHjpcj7KgBSmvEqULkVSeLmxTNkT/0",
      _description: descrption,
      _shippingAddress: returnAddress,
    };
    await createAuction(params);
    toggleIsLoading();
  };

  return (
    <Modal opened={opened} title="Auction Details" onClose={handleClose}>
      <TextInput
        label="Title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        withAsterisk
      />
      <TextInput
        label="Minimum Bid"
        type="number"
        placeholder="Minimum Bid in ETH"
        value={minimumBid}
        onChange={(e) => setMinimumBid(e.currentTarget.value)}
        withAsterisk
        mt="md"
      />
      <SimpleGrid cols={2} mt="md">
        <DateTimePicker
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endDate={endDate}
          setEndDate={setEndDate}
          endTime={endTime}
          setEndTime={setEndTime}
        />
      </SimpleGrid>
      <FileInput
        label="Item Images"
        placeholder="Upload files"
        multiple
        accept="image/*"
        withAsterisk
        value={images}
        onChange={setImages}
        mt="md"
      />
      {images.length > 0 ? (
        <Text fz="sm">{images.length} file(s) chosen</Text>
      ) : null}
      <Textarea
        placeholder="Item Description"
        label="Description"
        minRows={2}
        maxRows={4}
        value={descrption}
        onChange={(e) => setDescription(e.currentTarget.value)}
        withAsterisk
        mt="md"
      />
      <Textarea
        placeholder="Return Address"
        label="Return Address"
        minRows={2}
        maxRows={4}
        value={returnAddress}
        onChange={(e) => setReturnAddress(e.currentTarget.value)}
        withAsterisk
        mt="md"
      />
      <Box mt="md" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}
