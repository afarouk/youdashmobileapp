import { toIsoString } from "./helpers";

export const convertDateToIsoString = (year: number, month: number, day: number, hours: number, minutes: number) => {
  const d = new Date(year, month, day);
  d.setHours(hours, minutes);
    
  return toIsoString(d);
}