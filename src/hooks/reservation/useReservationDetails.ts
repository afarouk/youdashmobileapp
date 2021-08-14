import { useSelector } from "../../redux/store"

export const useReservationDetails = () => {
  const reservation = useSelector(state => state.reservation.data);

  return {
    reservation,
  }
}