import { Stepper, Text, Stack } from "@mantine/core";
import { STEPPER_LIST } from "@component/constants/stepper";

export default function AuctionProcessStepper() {
  return (
    <Stack>
      <Text fz="xl">Auction Registration Process</Text>
      <Stepper orientation="vertical" active={STEPPER_LIST.length}>
        {STEPPER_LIST.map((item, index) => (
          <Stepper.Step
            key={index}
            label={`Step ${index + 1}`}
            description={item}
            completedIcon={index + 1}
          />
        ))}
      </Stepper>
    </Stack>
  );
}
