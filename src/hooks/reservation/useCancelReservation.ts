import { useEffect } from "react";
import { Modal } from 'antd';
import { cancelReservationAction } from "../../redux/slices/reservationSlice";
import { useDispatch, useSelector } from "../../redux/store";
import { useRouting } from "../useRouting";

export const useCancelReservation = () => {
  const dispatch = useDispatch();
  const { goTo, ROUTE_NAME } = useRouting();
  const reservation = useSelector(state => state.reservation.data);

  useEffect(() => {
    if (!reservation) {
      // redirect to landing page after cancellation
      goTo({ routeName: ROUTE_NAME.LANDING });
    }
  }, [reservation])

  const cancelReservation = async () => {
    if (!reservation) {
      return;
    }

    await dispatch(cancelReservationAction({ entryId: reservation?.entryId }))
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

  return {
    cancelReservation,
    handleCancelClick,
  }
}