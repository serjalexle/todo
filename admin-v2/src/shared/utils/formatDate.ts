import dayjs from "dayjs";

export const formatDate = (date: number | string, type?: boolean) => {
  const dayjsLocal = dayjs(date);

  return dayjs(dayjsLocal).format(type ? "DD.MM.YYYY HH:mm:ss" : "DD.MM.YYYY");
};
