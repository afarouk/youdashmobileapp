import { useEffect } from 'react';

function initCayan() {
  const { CayanCheckout } = window;
  if (!CayanCheckout.setWebApiKey) {
    throw new Error('Payments external library was not found.')
  }
  CayanCheckout.setWebApiKey("CAQIJ8EHM0VHSCC8");
}

export default () => {
  let cayanInit = false;

  useEffect(() => {
    if (!window || !window.CayanCheckout || cayanInit) {
      return;
    }
    initCayan();
    cayanInit = true;
  }, []);
};
