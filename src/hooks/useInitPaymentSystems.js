import { useEffect } from "react";
import { useSelector } from "react-redux"

import { loadScript } from "../utils/loadScript";

import {
  CAYAN_CHECKOUT_KEY,
  CAYAN_CHECKOUT_SCRIPT_URL, 
  GLOBAL_PAYMENTS_KEY, 
  GLOBAL_PAYMENTS_SCRIPT_URL, 
  GOOGLE_RECAPTCHA_SCRIPT_URL, 
  NABANCARD_SCRIPT_URL, 
  PAYMENT_PROCESSOR,
} from "../config/constants";

export const useInitPaymentSystems = () => {
  const paymentProcessor = useSelector(state => state.business.data.onlineOrder.paymentProcessor);

  useEffect(() => {
    switch (paymentProcessor) {
      case PAYMENT_PROCESSOR.VANTIV_ECOMMERCE:
        return initVantivEcommerce();
      case PAYMENT_PROCESSOR.NABANCARD_ECOMMERCE:
        return initNabancard();
      case PAYMENT_PROCESSOR.HEARTLAND_ECOMMERCE:
        return initHeartland();

      default:
        return;
    }
  }, [paymentProcessor])
}

const initVantivEcommerce = () => {
  loadScript({
    id: 'cayan-checkout-script',
    src: CAYAN_CHECKOUT_SCRIPT_URL,
    onLoad: () => {
      setTimeout(() => {
        const { CayanCheckout } = window;
        if (!CayanCheckout.setWebApiKey) {
          throw new Error('CayanCheckout library was not found.')
        }
        CayanCheckout.setWebApiKey(CAYAN_CHECKOUT_KEY);
      })
    }
  })
}

const initNabancard = () => {
  // TODO: handle errors 
  loadScript({ id: 'nabancard-script', src: NABANCARD_SCRIPT_URL });
  loadScript({ id: 'recaptcha-script', src: GOOGLE_RECAPTCHA_SCRIPT_URL })
}

const initHeartland = () => {
  // TODO: handle errors 
  loadScript({ 
    id: 'heartland-globalpayments-script', 
    src: GLOBAL_PAYMENTS_SCRIPT_URL,
    onLoad: () => {
      setTimeout(() => {
        const { GlobalPayments } = window;
        if (!GlobalPayments.configure) {
          throw new Error('GlobalPayments library was not found.')
        }

        GlobalPayments.configure({
          publicApiKey: GLOBAL_PAYMENTS_KEY,
        });
      })
    }
  });
}