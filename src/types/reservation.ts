export type Reservation = {
  uid: string,
  entryId: string,
  callByName: string,
  mobile: string,
  email: string,
  startTime: string,
  entrySourceType: ENTRY_SOURCE_TYPE,
  preferredNotificationMethod: PREFERRED_NOTIFICATION_METHOD,
  count: string,

  // callByName: "Alex"
  // closerToRestroom: false
  // count: 1
  // disableAccess: false
  // durationMinutes: 0
  // email: "youdashmobile@hotmail.com"
  // entryId: 6
  // entrySourceType: "WEB"
  // globalEntryId: 6
  // havePets: false
  // highChair: false
  // lastNotified: null
  // localEntryId: null
  // mobile: "6503046414"
  // options: []
  // pagerId: null
  // preferredNotificationMethod: "SMS"
  // preferredTableTag: null
  // serviceAccommodatorId: "DEMFFF3"
  // serviceLocationId: "DEMFFF3"
  // startTime: null
  // status: "WAITING"
  // tablePath: null
  // timeIn: "2021-08-14T16:24:54:UTC"
  // uid: null
  // userLevel: "DEFAULT"
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

export enum ENTRY_SOURCE_TYPE {
  WEB = 'WEB',
}

export enum PREFERRED_NOTIFICATION_METHOD {
  SMS = 'SMS',
}