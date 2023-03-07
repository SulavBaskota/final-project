import {
  Modal,
  Text,
  Image,
  Textarea,
  Switch,
  Button,
  Group,
  Stack,
  Grid,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useStateContext } from "@component/context";
import { useEffect, useState } from "react";
import AuctionTimingDetails from "./AuctionTimingDetails";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";

export default function EvaluateAuctionModel({ opened, setOpened, auction }) {
  const [images, setImages] = useState([]);
  const [evaluationMessage, setEvaluationMessage] = useState("");
  const [itemReceived, setItemReceived] = useState(false);
  const { downloadFromIpfs, rejectAuction, verifyAuction } = useStateContext();

  const fetchAuctionData = async () => {
    const imageData = await downloadFromIpfs(auction.cid);
    setImages(imageData);
  };

  useEffect(() => {
    if (auction) fetchAuctionData();
  }, [auction]);

  const handleClose = () => {
    setImages([]);
    setEvaluationMessage("");
    setItemReceived(false);
    setOpened(false);
  };

  const handleReject = async () => {
    try {
      const txResponse = await rejectAuction(
        auction.id,
        itemReceived,
        evaluationMessage
      );
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
    }
  };

  const handleVerify = async () => {
    try {
      const txResponse = await verifyAuction(
        auction.id,
        itemReceived,
        evaluationMessage
      );
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
    }
  };

  return (
    <>
      {auction && images.length > 0 ? (
        <Modal
          size="70%"
          opened={opened}
          onClose={handleClose}
          title={auction.title}
        >
          <Grid>
            <Grid.Col sm={12} md={6}>
              <Carousel loop withIndicators>
                {images.map((image, index) => (
                  <Carousel.Slide key={index}>
                    <Image src={image} alt={`${auction.id}-image-${index}`} />
                  </Carousel.Slide>
                ))}
              </Carousel>
              <Stack mt="md">
                <Text>ID: {auction.id}</Text>
                <Text>Seller: {auction.seller}</Text>
                <AuctionTimingDetails
                  startTime={auction.startTime}
                  endTime={auction.endTime}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col sm={12} md={6}>
              <Text color="dimmed" mt="sm">
                {auction.description}
              </Text>
              <Stack mt="md">
                <Switch
                  label="Auction Item Received"
                  size="md"
                  checked={itemReceived}
                  onChange={(e) => setItemReceived(e.currentTarget.checked)}
                />
                <Textarea
                  placeholder="Evaluation Message"
                  label="Auction Evaluation Message"
                  withAsterisk
                  value={evaluationMessage}
                  onChange={(e) => setEvaluationMessage(e.currentTarget.value)}
                />
                <Group position="right">
                  <Button onClick={handleVerify}>Verify</Button>
                  <Button color="pink" onClick={handleReject}>
                    Reject
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Modal>
      ) : null}
    </>
  );
}
