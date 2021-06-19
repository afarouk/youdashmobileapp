
import { useInitGreenDining } from './green-dining/useInitGreenDining';
import { useInitPaymentSystems } from './useInitPaymentSystems';

export const useInit = () => {
  useInitPaymentSystems();
  useInitGreenDining();
};
