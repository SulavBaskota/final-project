import { Container, Stack, LoadingOverlay } from "@mantine/core";
import { useStateContext } from "@component/context";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useState } from "react";
import ShipmentMediaCard from "@component/components/ShipmentMediaCard";
import Unauthorized from "@component/components/Unauthorized";
import NoUnshippedItem from "@component/components/NoUnshippedItem";

export default function ShipItems() {
  const [visible, setVisible] = useState(true);
  const [unshippedItems, setUnshippedItems] = useState([]);
  const { start, clear } = useTimeout(() => setVisible(false), 500);
  const { role, BAFContract, signer, getUnshippedItems } = useStateContext();

  const fetchUnshippedItems = async () => {
    const data = await getUnshippedItems();
    setUnshippedItems(data);
  };

  useEffect(() => {
    start();
    return () => clear();
  }, []);

  useEffect(() => {
    if (role && (role === "admin" || role === "super")) {
      fetchUnshippedItems();
      const signedBAFContract = BAFContract.connect(signer);
      signedBAFContract.on("AuctionRejected", () => {
        fetchUnshippedItems();
      });
      signedBAFContract.on("AuctionSuccessful", () => {
        fetchUnshippedItems();
      });
      signedBAFContract.on("AuctionFailed", () => {
        fetchUnshippedItems();
      });
      signedBAFContract.on("ShippingAddressUpdated", () => {
        fetchUnshippedItems();
      });
      signedBAFContract.on("ShipmentStatusUpdated", () => {
        fetchUnshippedItems();
      });
    }

    return () =>
      BAFContract.removeAllListeners([
        "AuctionRejected",
        "AuctionSuccessful",
        "AuctionFailed",
        "ShippingAddressUpdated",
        "ShipmentStatusUpdated",
      ]);
  }, [signer, role]);

  return (
    <>
      {visible && <LoadingOverlay visible={visible} overlayBlur={2} />}
      {role && (role === "admin" || role === "super") ? (
        unshippedItems.length > 0 ? (
          <Container>
            <Stack>
              {unshippedItems.map((auction, index) => (
                <ShipmentMediaCard auction={auction} key={index} />
              ))}
            </Stack>
          </Container>
        ) : (
          <NoUnshippedItem />
        )
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
