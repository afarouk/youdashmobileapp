export type User = {
  address: string | null,
  adhocEntry: boolean,
  description: string,
  email: string,
  emailVerified: boolean,
  fingerPrintImage: any, // TODO: work on this type
  firstName: string,
  isOwner: boolean,
  kuid: string,
  lastName: string | null,
  message: string,
  messageCount: number,
  mobileVerified: boolean,
  phoneNumber: string,
  registrationState: string, // TODO: check if it's enum "LEVEL0"
  showMessage: boolean,
  uid: string,
  userName: string | null,
  userType: USER_TYPE,
}

export enum USER_TYPE  {
  MEMBER = 'MEMBER',
}