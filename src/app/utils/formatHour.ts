export const formatTo12Hour = (
  time: string | undefined | null,
): string | undefined => {
  if (!time) return undefined;
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  // Validate time
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return undefined;
  }

  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${h12}:${formattedMinutes} ${ampm}`;
};
