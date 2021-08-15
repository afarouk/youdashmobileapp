import { useDispatch, useSelector } from "../../redux/store"
import { ROUTE_NAME, useRouting } from "../useRouting";
import { selectReservationDate, selectReservationEnabled } from "../../redux/selectors/reservationSelectors";
import { addReservationAction } from "../../redux/slices/reservationSlice";

import { ENTRY_SOURCE_TYPE, PREFERRED_NOTIFICATION_METHOD } from "../../types/reservation";

export const useAddReservation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const peopleCount = useSelector(state => state.reservation.peopleCount);
  const reservationEnabled = useSelector(selectReservationEnabled);
  const reservationDate = useSelector(selectReservationDate);
  
  const { goTo } = useRouting()

  const {
    addReservationLoading,
    addReservationError,
  } = useSelector(state => state.reservation);
  
  const addReservation = async () => {
    if (!reservationDate) {
      console.error('addReservation: reservation date is missing');
      return;
    }

    if (!user) {
      console.error('addReservation: user is missing');
      return;
    }

    const result = await dispatch(addReservationAction({
      count: `${peopleCount}`,
      callByName: user.firstName,
      email: user.email,
      entrySourceType: ENTRY_SOURCE_TYPE.WEB,
      preferredNotificationMethod: PREFERRED_NOTIFICATION_METHOD.SMS,
      mobile: user.phoneNumber,
      startTime: reservationDate,
    }))

    if (typeof result.payload === 'object' && result.payload.entryId) {
      goTo({ routeName: ROUTE_NAME.RESERVATION_DETAILS });
    }
  }

  return {
    addReservation,
    addReservationLoading,
    addReservationError,
    reservationEnabled, 
    reservationDate, 
  }
}