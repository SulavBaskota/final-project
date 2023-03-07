import { Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

export default function AuctionTimingDetails({ startTime, endTime }) {
  return (
    <Group position="apart">
      <Stack spacing={0}>
        <Text size="sm" color="teal">
          Start Time
        </Text>
        <Text size="sm" color="dimmed">
          {dayjs.unix(startTime).format("DD/MM/YY, HH:mm")}
        </Text>
      </Stack>
      <Stack spacing={0} align="flex-end">
        <Text size="sm" color="orange">
          End Time
        </Text>
        <Text size="sm" color="dimmed">
          {dayjs.unix(endTime).format("DD/MM/YY, HH:mm")}
        </Text>
      </Stack>
    </Group>
  );
}
