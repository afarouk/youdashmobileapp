import { Modal } from 'antd';
import { cancelReservationAction, clearCancelReservationError } from "../../redux/slices/reservationSlice";
import { useDispatch, useSelector } from "../../redux/store";
import { useRouting } from "../useRouting";

export const useCancelReservation = () => {
  const dispatch = useDispatch();
  const { goTo, ROUTE_NAME } = useRouting();
  const reservation = useSelector(state => state.reservation.data);
  const cancelReservationError = useSelector(state => state.reservation.cancelReservationError);

  // useEffect(() => {
  //  This causes the bug wit redirects after user made a registration
  //   if (!reservation && initialDataLoaded) {
  //     console.log('cancel reservation redirect')
  //     // redirect to landing page after cancellation
  //     goTo({ routeName: ROUTE_NAME.LANDING });
  //   }
  // }, [reservation, initialDataLoaded])

  const cancelReservation = async () => {
    if (!reservation) {
      return;
    }

    const result = await dispatch(cancelReservationAction({ entryId: reservation?.entryId }))

    if (result.type === cancelReservationAction.fulfilled.toString()) {
      goTo({ routeName: ROUTE_NAME.LANDING });
    }
  }

  const handleCancelClick = async () => {
    Modal.warning({
      title: 'Do you want to cancel this reservation?',
      onOk: cancelReservation,
      okCancel: true,
      closable: true,
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
    })
  }

  const handleClearCancelReservationError = () => {
    dispatch(clearCancelReservationError())
  }

  return {
    cancelReservation,
    handleCancelClick,
    cancelReservationError,
    handleClearCancelReservationError,
  }
}