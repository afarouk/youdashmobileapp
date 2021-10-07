
import { useInitGreenDining } from './green-dining/useInitGreenDining';
import { useInitPaymentSystems } from './useInitPaymentSystems';
import { useReorderFromUrl } from './order-details/useReorderFromUrl';

export const useInit = () => {
  useInitPaymentSystems();
  useInitGreenDining();
  useReorderFromUrl();
};
