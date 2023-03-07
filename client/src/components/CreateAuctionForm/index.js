import { useState } from "react";
import { Button, Box, Modal, Text } from "@mantine/core";
import { calculateDateInUnix, validateInputs } from "@component/utils";
import { useStateContext } from "@component/context";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import CreateAuctionTextInputs from "./CreateAuctionTextInputs";
import CreateAuctionTextAreas from "./CreateAuctionTextAreas";
import CreateAuctionImageUpload from "./CreateAuctionImageUpload";
import DateTimePicker from "./DateTimePicker";

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

  const handleSubmit = async () => {
    // if (!validateInputs(title, images, descrption, returnAddress, setError))
    //   return;
    try {
      toggleIsLoading();
      const auctionStartTime = calculateDateInUnix(startDate, startTime);
      const auctionEndTime = calculateDateInUnix(endDate, endTime);
      // const cid = await uploadToIpfs(images);
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
      <CreateAuctionTextInputs
        title={title}
        setTitle={setTitle}
        minimumBid={minimumBid}
        setMinimumBid={setMinimumBid}
        error={error}
      />
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
      <CreateAuctionImageUpload
        images={images}
        setImages={setImages}
        error={error}
      />
      {images.length > 0 ? (
        <Text fz="sm">{images.length} file(s) chosen</Text>
      ) : null}
      <CreateAuctionTextAreas
        descrption={descrption}
        setDescription={setDescription}
        returnAddress={returnAddress}
        setReturnAddress={setReturnAddress}
        error={error}
      />
      <Box mt="md" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}
