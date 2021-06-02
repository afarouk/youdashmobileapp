import React, { useState, useEffect } from 'react';
import {default as CC} from "react-credit-cards";

import { Card } from '../../Shared/Card/Card';

import { GOOGLE_RECAPTCHA_KEY, NABANCARD_PUBLIC_KEY } from '../../../config/constants';

import '../Creditcard.css';
import '../CreditcardForm.css';

export const NabancardForm  = (props) => {
  const {
    ccData,
    issuer,
    focused,
    handleCallback,
    handleInputFocus,
    handleInputChange,
    onCardSubmitHandler,
    priceTotal,
    paymentTokenFieldsErrors,
  } = props;

  const { ccHolderName, ccNumber, ccExpiration, ccCVC, ccIssuer } = ccData;

  let [expMonth, setExpMonth] = useState("");
  let [expYear, setExpYear] = useState("");
  useEffect(() => {
    if (!ccExpiration) {
      return;
    }
    let chunks = ccExpiration.split('/');
    if (chunks.length <= 1) {
      setExpMonth("");
      setExpYear("");
      return;
    }
    setExpMonth(chunks[0]);
    setExpYear(chunks[1]);
  }, [ccExpiration]);

  let [cardNumber, setCardNumber] = useState("");
  useEffect(() => {
    if (ccNumber && ccNumber.length) {
      setCardNumber(ccNumber.replace(/\s/g,''));
    } else {
      setCardNumber("");
    }
  }, [ccNumber]);


  useEffect(() => {
    const velocitySuccessCallback = (msg) => {
      console.log('velocitySuccessCallback', msg)
    }
  
    const velocityFailureCallback = (msg) => {
      console.log('velocityFailureCallback', msg);
    }

    const handleCaptchaResponse = (response) => {
      // TODO: save captcha to state or to redux state ???
    }
      
    window.velocitySuccessCallback = velocitySuccessCallback;
    window.velocityFailureCallback = velocityFailureCallback;
  })

  // const errors = (paymentTokenFieldsErrors || []).reduce((acc, err) => {
  //   acc[err.reason] = err.error_code;
  //   return acc;
  // }, {})


  // TODO: on card submit do Velocity.sendPost()
  // TODO in success callback save data to redux store
  // TODO: after that call onCardSubmitHandler

  const handleSubmit = (event) => {
    event.preventDefault();
    window.Velocity.sendPost()
  } 

  return (
    <form className="form cc"  onSubmit={handleSubmit}>
      <Card>
        <div className="form-row form-title">
          <h4 className="flex font-size-lg primary-text">
            <span>Enter details</span>
          </h4>

          <CC
            number={ccNumber}
            name={ccHolderName}
            expiry={ccExpiration}
            cvc={ccCVC}
            focused={focused}
            callback={handleCallback}/>

        </div>

        <div className="form-field">
          <label htmlFor="PAN" className="font-size-sm required">
            Card Number
          </label>

          <input
            type="tel"
            name="PAN"
            id="PAN"
            className={`ant-input`}
            placeholder="Card Number"
            pattern="[\d| ]{16,22}"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}/>
        </div>

        <div className="form-field ant-form-item-has-error">
          <label htmlFor="name" className="font-size-sm required">
            Name
          </label>

          <input
            type="text"
            name="name"
            className={`ant-input`}
            placeholder="Name"
            required
            data-cayan="cardholder"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="Expire" className="font-size-sm required">
              Valid Thru
            </label>

            <input
              type="tel"
              name="Expire"
              id="Expire"
              className={`ant-input`}
              placeholder="MM/YY"
              pattern="\d\d/\d\d"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>

          <div className="divider-vertical"></div>

          <div className="form-field">
            <label htmlFor="cvc" className="font-size-sm required">
              CVV
            </label>

            <input
              type="tel"
              name="CVV"
              id="CVV"
              className={`ant-input`}
              placeholder="CVV"
              pattern="\d{3,4}"
              required
              data-cayan="cvv"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        <div className="form-field">
          <input type="hidden" name="Amount" value={priceTotal} />
          <input type="hidden" name="FailureCallback" value="velocityFailureCallback" />
          <input type="hidden" name="SuccessCallback" value="velocitySuccessCallback" />
          <input type="hidden" name="PublicKey" value={NABANCARD_PUBLIC_KEY} />
          <input type="hidden" id="reCaptcha" name="Captcha" value="bypass" />
          
          <input type="hidden" name="issuer" value={issuer} />
          <input type="hidden" name="expirationmonth" data-cayan="expirationmonth" value={expMonth}/>
          <input type="hidden" name="expirationyear" data-cayan="expirationyear" value={expYear}/>
          <input type="hidden" name="cardnumber" data-cayan="cardnumber" value={cardNumber}/>

          <button type="submit" className="hidden">Presubmit</button>
        </div>

        <div className="g-recaptcha" 
          id="g-recaptcha" 
          data-callback="handleCaptchaResponse" 
          data-sitekey={GOOGLE_RECAPTCHA_KEY}
        />
      </Card>
    </form>
  );
}