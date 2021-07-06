import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useLocation } from 'react-router-dom';

import { Card } from '../Shared/Card/Card';
import { CheckoutSuccess } from './CheckoutSuccess';
import { CheckoutLoading } from './CheckoutLoading';

import './CheckoutIFrameRedirect.css';


function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
//TODO: add a loader here
export const CheckoutIFrameRedirect = () => {
  const { search } = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    const hostedPaymentStatus = urlParams.get('HostedPaymentStatus');

    if (inIframe() && (hostedPaymentStatus === 'Cancelled' || hostedPaymentStatus === 'Complete')) {
      setPaymentStatus(hostedPaymentStatus);
      window.top.postMessage(
        {
          error: false,
          message: search
        },
        window.location.origin
      );
    }
  }, [search]);
  return (
    <Card className={'redirect-container'}>
      <CheckoutLoading />
    </Card>
  );
/*   return <Card className={'redirect-container'}>
    {paymentStatus === 'Complete' ? <CheckoutSuccess /> : <CheckoutLoading />}
  </Card>*/
};
