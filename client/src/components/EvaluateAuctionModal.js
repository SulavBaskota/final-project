import { Modal, Text, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useStateContext } from "@component/context";
import { useEffect, useState } from "react";

export default function EvaluateAuctionModel({ opened, setOpened, auction }) {
  const [images, setImages] = useState([]);
  const { downloadFromIpfs } = useStateContext();

  const fetchAuctionData = async () => {
    const imageData = await downloadFromIpfs(auction.cid);
    setImages(imageData);
  };

  useEffect(() => {
    if (auction) fetchAuctionData();
  }, [auction]);

  const handleClose = () => {
    setOpened(false);
  };

  return (
    <>
      {auction && images.length > 0 ? (
        <Modal opened={opened} onClose={handleClose} title="Evaluate Auction">
          <Carousel mx="auto" withIndicators height={300} loop>
            {images.map((image, index) => (
              <Carousel.Slide key={index}>
                <Image src={image} alt={`${auction.id}-image-${index}`} />
              </Carousel.Slide>
            ))}
          </Carousel>
          <Text>{auction.title}</Text>
        </Modal>
      ) : null}
    </>
  );
}
