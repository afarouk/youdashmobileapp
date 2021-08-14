import React from 'react';

import format from 'date-fns/format'
import { Card } from '../Shared/Card/Card';
import { Reservation } from '../../types/reservation';

type Props = {
  reservation: Reservation | null,
}

export const ReservationInfoCard: React.VFC<Props> = ({ reservation }) => {
  let formattedReservationTime = '';

  if (reservation) {
    const reservationTime = new Date(reservation.startTime);
    formattedReservationTime = ` ${format(reservationTime, 'MMMM d, h:mmaaa')}`;
  }

  return (
    <Card className="mb-default">
      <h1 className="font-size-lg">Table request received</h1>
      <div className="font-size-xl">{formattedReservationTime}</div>
      <div className="font-size-xl">Party of {reservation?.count}</div>
      <div className="font-size-md mb-default">System Id {reservation?.entryId}</div>

      <div className="flex font-size-md">
        <div>Name</div>
        <div className="bold">{reservation?.callByName}</div>
      </div>
    </Card>
  )
}