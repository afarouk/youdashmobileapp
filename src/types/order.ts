import { DeliveryType } from "../config/constants";
import { OrderStatus } from "./shoppingCartTypes";

type OrderStatusData = {
  cyclicOrderIdInt: number,
  cyclicOrderIdType: number,
  cylicOrderIdString: string,
  day: number,
  deliveryType: {
    id: number, 
    enumText: DeliveryType, 
    displayText: string,
  },
  hour: number,
  message: string, // Enum?
  minute: number,
  month: number,
  notes: string,
  orderFactoryStatus: string, // Enum ?
  orderId: number
  orderStatus: OrderStatus,
  orderUUID: string,
  pricePaid: number,
  serviceAccommodatorId: string,
  serviceLocationId: string,
  stationId: number,
  tablePath: string, // Example "2#5#10" -> zoneId#levelId#tableId -> sectionId#floorId#tableId
  userSASLid: number
  year: number,
}