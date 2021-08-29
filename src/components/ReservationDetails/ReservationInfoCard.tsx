import React from 'react';

import format from 'date-fns/format'
import { Card } from '../Shared/Card/Card';
import { Reservation } from '../../types/reservation';
import { Button } from 'antd';
import { useCancelReservation } from '../../hooks/reservation/useCancelReservation';


type Props = {
  reservation: Reservation | null,
}

export const ReservationInfoCard: React.VFC<Props> = ({ reservation }) => {
  let formattedReservationTime = '';

  const { handleCancelClick } = useCancelReservation();

  if (reservation && reservation.year && reservation.year > 0) {
    const { year, month, day, hour, minute } = reservation;
    const reservationTime = new Date(year, month, day, hour, minute);
    formattedReservationTime = ` ${format(reservationTime, 'MMMM d, h:mmaaa')}`;
  }


  return (
    <Card className="mb-default">
      <h1 className="font-size-lg">Table request received</h1>
      <div className="font-size-xl">{formattedReservationTime}</div>
      <div className="font-size-xl">Party of {reservation?.count}</div>
      <div className="font-size-md mb-default">System Id {reservation?.entryId}</div>

      <div className="flex font-size-md mb-default">
        <div>Name</div>
        <div className="bold">{reservation?.callByName}</div>
      </div>
      <Button
        size="middle"
        type="text"
        htmlType="button"
        loading={false}
        disabled={false}
        onClick={handleCancelClick}
      >
        Cancel
      </Button>
    </Card>
  )
}