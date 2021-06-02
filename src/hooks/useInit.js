import { useEffect } from 'react';
import { CAYAN_CHECKOUT_KEY, GLOBAL_PAYMENTS_KEY } from '../config/constants';

function initCayan() {
  const { CayanCheckout } = window;
  if (!CayanCheckout.setWebApiKey) {
    throw new Error('Payments external library was not found.')
  }
  CayanCheckout.setWebApiKey(CAYAN_CHECKOUT_KEY);
}

const initGlobalPayments = () => {
  if (!window.GlobalPayments || !window.GlobalPayments.configure) {
    console.error('GlobalPayments is missing');
    return;
  }

  window.GlobalPayments.configure({
    publicApiKey: GLOBAL_PAYMENTS_KEY
  });
}

export default () => {
  useEffect(() => {
    if (!window) {
      return;
    }

    if (window.CayanCheckout) {
      initCayan();
    }

    initGlobalPayments();
  }, []);
};
