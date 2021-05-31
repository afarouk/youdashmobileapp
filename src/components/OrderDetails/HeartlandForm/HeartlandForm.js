import React from 'react'

import { Card } from '../../Shared/Card/Card';


export const HeartlandForm = () => {
  return (
    <Card>
      <form id="payment-form" action="/charge" method="get">
        <label for="billing-zip">Billing Zip Code</label>
        <input id="billing-zip" name="billing-zip" type="tel" />

        <div id="credit-card-card-holder"></div>
        <div id="credit-card-card-number"></div>
        <div id="credit-card-card-cvv"></div>
        <div id="credit-card-card-expiration"></div>
        <div id="credit-card-submit"></div>
      </form>
    </Card>
  )
}