import { PickUpDayConfig } from "./businessData";

export enum ORDERING_STATE {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  CANCELLED = 'CANCELLED',
  SUCCESS = 'SUCCESS',
}


export type GreenDiningDetails = {
  discountMetaData: Record<string, any> & {
    maxUseCount: number,
    discountUUID: string,
    type: string, // TODO: ENUM here
    discount: number,
    title: string,
    description: string, 
    applicableOrderUUID: string,
    isGreenDiningDeal: boolean,
    imageURL: string,
  },
  // TODO: work on this type -> it's general order history type ???
  sampleOrder: {
    items: any[],
    [key: string]: any,
  },
  pickupDayTime: PickUpDayConfig,
  lastAvailableCount: number,
}