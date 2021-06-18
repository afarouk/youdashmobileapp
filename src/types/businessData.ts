export type BusinessData = {
  pickUp: {
    dayPickUpTimes: DayPickUpTimes
    isOpen: any,
    isOpenWarningMessage: any,
    address: {
      city: string | null,
      country: string  | null,
      state: string | null,
      street: string | null,
      timeZone: string | null,
      locale: string | null,
      zip: string | null,
    }
  },
  [key: string]: any,
}

export type DayPickUpTimes = PickUpDayConfig[];

export type PickUpDayConfig = {
  day: PickUpDay,
  times: PickUpTime[],
}

type PickUpDay = {
  year: number,
  month: number,
  day: number,
  dayOfWeek: string, // TODO: use enum here Tue
  displayText: string,
  status: PICK_UP_DAY_STATUS
  date: string, // example 2021.06.18
}

export enum PICK_UP_DAY_STATUS {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  AVAILABLE = 'AVAILABLE',
}

type PickUpTime = {
  hour: number,
  minute: number,
}