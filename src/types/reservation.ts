export type Reservation = {
  uid: string,
  entryId: string,
  callByName: string,
  mobile: string,
  email: string,
  startTime: string,
  entrySourceType: ENTRY_SOURCE_TYPE,
  preferredNotificationMethod: PREFERRED_NOTIFICATION_METHOD,
  count: number,
  status: string // WAITING -> enum ??

  // date
  day: number,
  hour: number,
  minute: number,
  month: number,
  year: number


  // callByName: "Alex"
  // closerToRestroom: false
  // count: 1
  // day: 16
  // disableAccess: false
  // durationMinutes: 0
  // email: "youdashmobile@hotmail.com"
  // entryId: 16
  // entrySourceType: "WEB"
  // globalEntryId: 16
  // havePets: false
  // highChair: false
  // hour: 22
  // lastNotified: null
  // localEntryId: null
  // minute: 0
  // mobile: "6503046414"
  // month: 7
  // options: []
  // pagerId: null
  // preferredNotificationMethod: "SMS"
  // preferredTableTag: null
  // serviceAccommodatorId: "DEMFFF3"
  // serviceLocationId: "DEMFFF3"
  // startTime: "2021-08-17T05:00:00:UTC"
  // status: "WAITING"
  // tablePath: null
  // timeIn: "2021-08-17T14:00:17:UTC"
  // uid: null
  // userLevel: "DEFAULT"
  // year: 2021
}

export type AddReservationData = {
  callByName: string,
  mobile: string,
  email: string,
  startTime: string,
  entrySourceType: ENTRY_SOURCE_TYPE,
  preferredNotificationMethod: PREFERRED_NOTIFICATION_METHOD,
  count: string,
}

export type AddReservationApiParams = AddReservationData & {
  serviceAccommodatorId: string,
  serviceLocationId: string,
  uid: string,
}

export type CancelWaitListEntryParams = {
  serviceAccommodatorId: string,
  serviceLocationId: string,
  UID: string,
  entryId: string,
}

export type CancelReservationData = {
  entryId: string,
}

export type CancelWaitListEntryResponse = any;

export enum ENTRY_SOURCE_TYPE {
  WEB = 'WEB',
}

export enum PREFERRED_NOTIFICATION_METHOD {
  SMS = 'SMS',
}