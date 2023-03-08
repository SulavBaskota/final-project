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

// Need to remove later on
const cid = [
  "https://gateway.ipfscdn.io/ipfs/QmSdn7fERhNW76YTZcCHjpcj7KgBSmvEqULkVSeLmxTNkT/0",
  "https://gateway.ipfscdn.io/ipfs/Qma6zxbbYD1nFpJuZEQA9Xbi7bUyw5ktZb8weCvAxrYTFE/0",
  "https://gateway.ipfscdn.io/ipfs/QmbtETQy24fNBQnpASTptHibmh1go6KBBtpyztnf1C5krG/0",
  "https://gateway.ipfscdn.io/ipfs/QmcStaafWvd5zZs1qtjsa2xvJ8Eq43QNiFEe5JRM32VDtM/0",
];

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
        // _cid: cid,
        _cid: cid[0],
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
