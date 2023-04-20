import { Grid, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function CountDownTimer({
  time,
  title,
  timePassed,
  setTimePassed,
  displayTimer,
}) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const GridColumns = ({ value, unit }) => (
    <Grid.Col span={3}>
      <Stack>
        <Text align="center" color="pink" fz={30}>
          {value}
        </Text>
        <Text fz="sm" align="center" color="dimmed">
          {unit}
        </Text>
      </Stack>
    </Grid.Col>
  );

  useEffect(() => {
    const target = new Date(time * 1000);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);

      if (d <= 0 && h <= 0 && m <= 0 && s <= 0) {
        setTimePassed(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <>
      <Text align="center" fz={20} tt="capitalize">
        {title} time
      </Text>

      <Grid justify="center" align="center">
        {timePassed || !displayTimer ? (
          <Grid.Col>
            <Text fz="lg" align="center" color={timePassed ? "pink" : "teal"}>
              {dayjs.unix(time).format("DD/MM/YY, HH:mm A")}
            </Text>
          </Grid.Col>
        ) : (
          <>
            <GridColumns value={days} unit="Days" />
            <GridColumns value={hours} unit="Hours" />
            <GridColumns value={minutes} unit="Minutes" />
            <GridColumns value={seconds} unit="Seconds" />
          </>
        )}
      </Grid>
    </>
  );
}
