import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Box, Modal, Text } from "@mantine/core";
import { calculateDateInUnix } from "@component/utils";
import { useStateContext } from "@component/context";
import {
  showSuccessNotification,
  showErrorNotification,
} from "@component/utils";
import CreateAuctionTextInputs from "./CreateAuctionTextInputs";
import CreateAuctionTextAreas from "./CreateAuctionTextAreas";
import CreateAuctionImageUpload from "./CreateAuctionImageUpload";
import DateTimePicker from "./DateTimePicker";



export default function CreateAuctionForm({ opened, setOpened }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [minimumBid, setMinimumBid] = useState("0");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [images, setImages] = useState([]);
  const [descrption, setDescription] = useState("");
  const [returnAddress, setReturnAddress] = useState("");

  const { createAuction, uploadToIpfs, toggleIsLoading, getRevertMessage } =
    useStateContext();

  const resetStates = () => {
    setTitle("");
    setMinimumBid("0");
    setStartDate(new Date());
    setStartTime(new Date());
    setEndDate(new Date());
    setEndTime(new Date());
    setImages([]);
    setDescription("");
    setReturnAddress("");
  };

  const handleClose = () => {
    resetStates();
    setOpened(false);
  };

  const handleSubmit = async () => {
    if (images.length == 0) {
      showErrorNotification("Choose upto 4 images");
      return;
    }
    if (images.length > 4) {
      showErrorNotification("Choose upto 4 images only");
      return;
    }
    try {
      toggleIsLoading();
      const auctionStartTime = calculateDateInUnix(startDate, startTime);
      const auctionEndTime = calculateDateInUnix(endDate, endTime);
      const cid = await uploadToIpfs(images);
      console.log(cid);
      const params = {
        _title: title,
        _startTime: auctionStartTime,
        _endTime: auctionEndTime,
        _minimumBid: minimumBid,
        _cid: cid.toString(),
        _description: descrption,
        _shippingAddress: returnAddress,
      };
      const txResponse = await createAuction(params);
      await txResponse.wait();
      handleClose();
      showSuccessNotification("Auction created successfully");
      router.push("/auction/bookmarks");
    } catch (e) {
      const revertMessage = getRevertMessage(e);
      showErrorNotification(revertMessage);
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
      <CreateAuctionImageUpload images={images} setImages={setImages} />
      {images.length > 0 ? (
        <Text fz="sm">{images.length} file(s) chosen</Text>
      ) : null}
      <CreateAuctionTextAreas
        descrption={descrption}
        setDescription={setDescription}
        returnAddress={returnAddress}
        setReturnAddress={setReturnAddress}
      />
      <Box mt="md" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}
