import { Text, Box } from "@mantine/core";
import { SHIPPING_DETAILS } from "@component/constants/shippingDetails";

export default function ShippingDetails() {
  return (
    <Box>
      <Text fz="xl">Auction Item Shipping Details:</Text>
      {SHIPPING_DETAILS.map((item, index) => (
        <Text fz="md" key={index}>
          {item}
        </Text>
      ))}

      <Text fz="md" fs="italic">
        <span style={{ color: "red" }}>*</span>Please use auction address as
        sender name
      </Text>
    </Box>
  );
}
