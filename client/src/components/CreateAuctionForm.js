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
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

export default function CreateAuctionForm({ opened, setOpened }) {
  const [title, setTitle] = useState("");
  const [minimumBid, setMinimumBid] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [images, setImages] = useState([]);
  const [descrption, setDescription] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [error, setError] = useState({});

  const { createAuction, uploadToIpfs, toggleIsLoading } = useStateContext();

  const resetStates = () => {
    setTitle("");
    setMinimumBid(0);
    setStartDate(new Date());
    setStartTime(new Date());
    setEndDate(new Date());
    setEndTime(new Date());
    setImages([]);
    setDescription("");
    setReturnAddress("");
    setError({});
  };

  const handleClose = () => {
    resetStates();
    setOpened(false);
  };

  const validateInputs = () => {
    if (!title) {
      setError({
        title: "Title cannot be empty",
      });
      return false;
    } else if (!images.length) {
      setError({
        images: "Please upload item images",
      });
      return false;
    } else if (descrption.length < 20 || descrption.length > 100) {
      setError({
        descrption: "Description must be between 20 to 100 characters long",
      });
      return false;
    } else if (returnAddress.length < 20 || returnAddress.length > 100) {
      setError({
        returnAddress:
          "Return address must be between 20 to 100 characters long",
      });
      return false;
    } else {
      setError({});
      return true;
    }
  };

  const handleSubmit = async () => {
    // if (!validateInputs()) return;
    try {
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
      const txResponse = await createAuction(params);
      await txResponse.wait();
      handleClose();
      showNotification({
        autoClose: 5000,
        title: "Success!!",
        message: "Auction created successfully",
        color: "teal",
        icon: <IconCheck size={20} />,
      });
    } catch (e) {
      console.log(e);
    } finally {
      toggleIsLoading();
    }
  };

  return (
    <Modal opened={opened} title="Auction Details" onClose={handleClose}>
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
        error={error?.images ? error.images : ""}
        autoComplete="off"
        mt="md"
      />
      {images.length > 0 ? (
        <Text fz="sm">{images.length} file(s) chosen</Text>
      ) : null}
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
      <Box mt="md" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}
