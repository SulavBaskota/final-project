export const calculateDateInUnix = (date, time) => {
  const newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
  return newDate.valueOf() / 1000;
};
