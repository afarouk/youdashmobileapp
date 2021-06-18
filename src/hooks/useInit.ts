import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
  SIMPLE_ORDER_UUID_QUERY_PARAMETER_NAME,
  DISCOUNT_UUID_QUERY_PARAMETER_NAME,
} from '../config/constants';
import { getGreenDiningDetails, setDiscountUUID, setSouuid } from '../redux/slices/greenDiningSlice';

import { useSelector } from '../redux/store';
import { useInitPaymentSystems } from './useInitPaymentSystems';

export const useInit = () => {
  useInitPaymentSystems();
  useGreenDining();
};

// TODO: move it to some other file
const useGreenDining = () => {
  const dispatch = useDispatch();
  const serviceAccommodatorId: any = useSelector(state => state.business.data.serviceAccommodatorId);
  const serviceLocationId: any = useSelector(state => state.business.data.serviceLocationId);

  useEffect(() => {
    if (!serviceAccommodatorId || !serviceLocationId) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const simpleOrderUUID = params.get(SIMPLE_ORDER_UUID_QUERY_PARAMETER_NAME);
    const discountUUID = params.get(DISCOUNT_UUID_QUERY_PARAMETER_NAME);

    if (simpleOrderUUID && discountUUID) {
      dispatch(setSouuid(simpleOrderUUID));
      dispatch(setDiscountUUID(discountUUID));
      
      dispatch(getGreenDiningDetails({
        discountUUID,
        serviceLocationId,
        serviceAccommodatorId,
        souuid: simpleOrderUUID,
      }))
    }
  }, [serviceAccommodatorId, serviceLocationId])
}