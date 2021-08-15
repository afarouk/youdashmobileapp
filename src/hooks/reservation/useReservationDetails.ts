import { useSelector } from "../../redux/store"
import { selectserviceLocationId } from "../../redux/selectors/businessSelectors";

export const useReservationDetails = () => {
  const reservation = useSelector(state => state.reservation.data);
  const serviceLocationId = useSelector(selectserviceLocationId);

  const barcode = `wlx_${reservation?.entryId || ''}_${serviceLocationId || ''}`;

  return {
    reservation,
    barcode,
  }
}