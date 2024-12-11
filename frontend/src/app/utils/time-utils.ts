export const isFutureDate = (dateTime: Date) => {
  const currentDate = new Date();
  return new Date(dateTime) > currentDate;
}
