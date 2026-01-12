export const formatTo12Hour = (time: string) => {
  const [hourStr, minute] = time.split(":");
  let hour = Number(hourStr);

  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
};
