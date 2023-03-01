import { DatePicker, TimeInput } from "@mantine/dates";

export default function DateTimePicker({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
}) {
  return (
    <>
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
    </>
  );
}
