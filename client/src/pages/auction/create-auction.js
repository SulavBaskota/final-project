import { use, useState } from "react";
import {
  Container,
  TextInput,
  Stack,
  Group,
  Button,
  Box,
  Modal,
  SimpleGrid,
  Textarea,
  FileInput,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useRouter } from "next/router";

export default function CreateAuction() {
  const router = useRouter();
  const [opened, setOpened] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const handleClose = () => {
    setOpened(false);
    router.back();
  };

  const handleSubmit = async () => {
    const auctionStartTime = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );
    const auctionEndTime = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    );
    console.log(auctionStartTime.valueOf() / 1000);
    console.log(auctionEndTime.valueOf() / 1000);
  };

  return (
    <Modal opened={opened} title="Auction Details" onClose={handleClose}>
      <TextInput label="Title" placeholder="Title" withAsterisk />
      <TextInput
        label="Minimum Bid"
        type="number"
        placeholder="Minimum Bid in ETH"
        withAsterisk
        mt="md"
      />
      <SimpleGrid cols={2} mt="md">
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          withAsterisk
        />
        <TimeInput
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          withAsterisk
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          withAsterisk
        />
        <TimeInput
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          withAsterisk
        />
      </SimpleGrid>
      <FileInput
        label="Item Images"
        placeholder="Upload files"
        multiple
        accept="image/*"
        withAsterisk
        mt="md"
      />
      <Textarea
        placeholder="Item Description"
        label="Description"
        minRows={2}
        maxRows={4}
        withAsterisk
        mt="md"
      />
      <Textarea
        placeholder="Return Address"
        label="Return Address"
        minRows={2}
        maxRows={4}
        withAsterisk
        mt="md"
      />
      <Box mt="md" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
}
