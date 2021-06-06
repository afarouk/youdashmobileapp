export type GetGreenDiningDetailsParams = {
  serviceAccommodatorId: string,
  serviceLocationId: string,
  souuid: string,
  discountUUID: string,
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
  sampleOrder: Record<string, any>,
  lastAvailableCount: number,
}

export type  GetGreenDiningDetailsResponse = GreenDiningDetails;

export type BlockGreenDiningOrderParams = {
  discountUUID: string,
  souuid: string,
  serviceAccommodatorId: string,
  serviceLocationId: string,
  blockDurationSeconds: number,
  blockCount: number,
}

export type BlockGreenDiningOrderResponse = {
  blockUUID: string,
  blockCount: number,
  secondsToPay: number,
}

export type CancelGreenDiningBlockParams = {
  discountUUID: string,
  blockUUID: string,
  serviceAccommodatorId: string,
  serviceLocationId: string,
}

export type CancelGreenDiningBlockResponse = any;
