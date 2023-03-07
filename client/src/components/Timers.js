import { useState } from "react";
import { Divider } from "@mantine/core";
import CountDownTimer from "./CountDownTimer";

export default function Timers({ startTime, endTime, revealTime }) {
  const [startTimePassed, setStartTimePassed] = useState(false);
  const [endTimePassed, setEndTimePassed] = useState(false);
  const [revealTimePassed, setRevealTimePassed] = useState(false);

  return (
    <>
      <CountDownTimer
        time={startTime}
        title="start"
        timePassed={startTimePassed}
        setTimePassed={setStartTimePassed}
        displayTimer={!startTimePassed}
      />
      <Divider size="md" />
      <CountDownTimer
        time={endTime}
        title="end"
        timePassed={endTimePassed}
        setTimePassed={setEndTimePassed}
        displayTimer={startTimePassed}
      />
      <Divider size="md" />
      <CountDownTimer
        time={revealTime}
        title="reveal"
        timePassed={revealTimePassed}
        setTimePassed={setRevealTimePassed}
        displayTimer={endTimePassed}
      />
    </>
  );
}
