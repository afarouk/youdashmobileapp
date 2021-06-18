export type DayPickUpTimes = [
  day: PickUpDay,
  times: PickUpTime[],
]

type PickUpDay = {
  year: number,
  month: number,
  day: number,
  dayOfWeek: string, // TODO: use enum here Tue
  displayText: string,
  status: PickUpDayStatus
}

enum PickUpDayStatus {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  AVAILABLE = 'AVAILABLE',
}

type PickUpTime = {
  hour: number,
  minute: number,
}