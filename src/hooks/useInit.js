import { useEffect } from 'react';
import { CAYAN_CHECKOUT_KEY, GLOBAL_PAYMENTS_KEY } from '../config/constants';
import { useInitPaymentSystems } from './useInitPaymentSystems';

export default () => {
  useInitPaymentSystems();
};
