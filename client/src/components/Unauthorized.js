import { Center, Text } from "@mantine/core";

export default function Unauthorized() {
  return (
    <Center>
      <Text fz="xl" weight={700}>
        401 - Unauthorized
      </Text>
    </Center>
  );
}
