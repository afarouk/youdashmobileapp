import { addReservationAction } from "../../redux/slices/reservationSlice";
import { useDispatch, useSelector } from "../../redux/store"
import { ENTRY_SOURCE_TYPE, PREFERRED_NOTIFICATION_METHOD } from "../../types/reservation";
import { ROUTE_NAME, useRouting } from "../useRouting";

export const useAddReservation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const peopleCount = useSelector(state => state.reservation.peopleCount);
  
  const { goTo } = useRouting()

  const {
    addReservationLoading,
    addReservationError,
  } = useSelector(state => state.reservation);
  
  const addReservation = async () => {
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
      startTime: '', // TODO: add start time
    }))

    console.log('result', result)

    if (typeof result.payload === 'object' && result.payload.entryId) {
      goTo({ routeName: ROUTE_NAME.RESERVATION_DETAILS });
    }
  }

  return {
    addReservation,
    addReservationLoading,
    addReservationError,
  }
}