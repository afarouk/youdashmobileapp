import React from 'react';
import { Select as AntDSelect } from 'antd';

import { RESERVATION_MAX_PEOPLE_COUNT } from '../../config/constants';

import { Card } from '../Shared/Card/Card';
import { PickUpSelectors } from '../Shared/PickUpSelectors/PickUpSelectors';

import { BusinessData } from '../../types/businessData';
import { User } from '../../types/user';

import './ReservationForm.css';
import { useDispatch, useSelector } from '../../redux/store';
import { setPeopleCount } from '../../redux/slices/reservationSlice';

type Props = {
  businessData: BusinessData,
  user: User,
}

export const ReservationFields: React.VFC<Props> = ({
  businessData,
  user,
}) => {
  const dispatch = useDispatch();
  const peopleCount = useSelector(state => state.reservation.peopleCount);

  const peopleCountOptions = Array.from({length: RESERVATION_MAX_PEOPLE_COUNT}, (_, i) => i + 1);

  const handlePeopleCountChange = (count: string) => {
    dispatch(setPeopleCount(parseInt(count)));
  }

  return (
    <Card className="reservation-form mb-default">
      <h4 className="font-size-lg primary-text text-center mb-default">Preferred Time</h4>
      <div className="flex reservation-form__time-wrapper">
        <PickUpSelectors user={user} businessData={businessData} />
      </div>

      <div className="flex">
        <div className="full-width reservation-form__people-label">How many people</div>
        <AntDSelect
          placeholder={'Count'}
          value={`${peopleCount}`}
          defaultValue="1"
          onChange={handlePeopleCountChange}
          className="primary-text-picker"
        >
          {peopleCountOptions.map((count) => (
            <AntDSelect.Option value={count} key={count}>
              {count === RESERVATION_MAX_PEOPLE_COUNT ? `${count}+` : count}
            </AntDSelect.Option>
          ))}
        </AntDSelect>
      </div>
    </Card>
  )
}