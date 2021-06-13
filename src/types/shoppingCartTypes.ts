export type OrderStatus = any

export type TableDetails = {
  levelId: string, 
  zoneId: string, 
  tableId: string,
}

export enum CheckoutMode {
  USER_DATA = 'USER_DATA',
  CARD_PAYMENT_PRESTEP = 'CARD_PAYMENT_PRESTEP',
  CARD_PAYMENT = 'CARD_PAYMENT',
};