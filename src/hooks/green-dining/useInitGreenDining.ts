
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { 
  SIMPLE_ORDER_UUID_QUERY_PARAMETER_NAME,
  DISCOUNT_UUID_QUERY_PARAMETER_NAME,
  EXPIRATION_DATE_QUERY_PARAMETER_NAME,
  GREEN_DINING_DISABLED_QUERY_PARAMETER_NAME,
} from '../../config/constants';
import { getGreenDiningDetails, setDiscountUUID, setSouuid } from '../../redux/slices/greenDiningSlice';

import { useSelector } from '../../redux/store';

export const useInitGreenDining = () => {
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
    const expirationDateBase64 = params.get(EXPIRATION_DATE_QUERY_PARAMETER_NAME);

    if (!simpleOrderUUID || !discountUUID) {
      return;
    }

    if (isExpired(expirationDateBase64)) {
      return;
    }

    if (params.get(GREEN_DINING_DISABLED_QUERY_PARAMETER_NAME)) {
      return;
    }

    params.set(GREEN_DINING_DISABLED_QUERY_PARAMETER_NAME, '1');
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)

    dispatch(setSouuid(simpleOrderUUID));
    dispatch(setDiscountUUID(discountUUID));
    
    dispatch(getGreenDiningDetails({
      discountUUID,
      serviceLocationId,
      serviceAccommodatorId,
      souuid: simpleOrderUUID,
    }))
  }, [serviceAccommodatorId, serviceLocationId])
}

const isExpired = (expirationDateBase64: string | null) => {
  if (!expirationDateBase64) {
    return true;
  }

  const expirationDateStr = atob(expirationDateBase64);

  if (!expirationDateStr) {
    return true;
  }

  // TODO improve date validation test it on different timezones
  const expirationDate = new Date(expirationDateStr);
  const now = new Date();

  return expirationDate <= now;
}