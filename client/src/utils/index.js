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

export const validateInputs = (
  title,
  images,
  descrption,
  returnAddress,
  setError
) => {
  if (!title) {
    setError({
      title: "Title cannot be empty",
    });
    return false;
  } else if (!images.length) {
    setError({
      images: "Please upload item images",
    });
    return false;
  } else if (descrption.length < 20 || descrption.length > 100) {
    setError({
      descrption: "Description must be between 20 to 100 characters long",
    });
    return false;
  } else if (returnAddress.length < 20 || returnAddress.length > 100) {
    setError({
      returnAddress: "Return address must be between 20 to 100 characters long",
    });
    return false;
  } else {
    setError({});
    return true;
  }
};
