import { GreenDiningDetails } from "./greenDining";

export type GetGreenDiningDetailsParams = {
  serviceAccommodatorId: string,
  serviceLocationId: string,
  souuid: string,
  discountUUID: string,
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
  showMessage: boolean,
  message: string,
}

export type CancelGreenDiningBlockParams = {
  discountUUID: string,
  blockUUID: string,
  serviceAccommodatorId: string,
  serviceLocationId: string,
}

export type CancelGreenDiningBlockResponse = any;
