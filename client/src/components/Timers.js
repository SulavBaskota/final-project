import { Divider } from "@mantine/core";
import CountDownTimer from "./CountDownTimer";
import { AUCTIONSTATE } from "@component/constants";

export default function Timers({
  auctionState,
  startTime,
  endTime,
  revealTime,
  startTimePassed,
  setStartTimePassed,
  endTimePassed,
  setEndTimePassed,
  revealTimePassed,
  setRevealTimePassed,
}) {
  return (
    <>
      <CountDownTimer
        time={startTime}
        title="start"
        timePassed={startTimePassed}
        setTimePassed={setStartTimePassed}
        displayTimer={!startTimePassed && auctionState === AUCTIONSTATE.OPEN}
      />
      <Divider size="md" />
      <CountDownTimer
        time={endTime}
        title="end"
        timePassed={endTimePassed}
        setTimePassed={setEndTimePassed}
        displayTimer={startTimePassed && auctionState === AUCTIONSTATE.OPEN}
      />
      <Divider size="md" />
      <CountDownTimer
        time={revealTime}
        title="reveal"
        timePassed={revealTimePassed}
        setTimePassed={setRevealTimePassed}
        displayTimer={endTimePassed && auctionState === AUCTIONSTATE.OPEN}
      />
    </>
  );
}
