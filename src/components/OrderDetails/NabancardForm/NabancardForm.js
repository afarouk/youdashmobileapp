import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {default as CC} from "react-credit-cards";

import { Alert, Button } from 'antd';
import { Card } from '../../Shared/Card/Card';

import { GOOGLE_RECAPTCHA_KEY, NABANCARD_PUBLIC_KEY } from '../../../config/constants';
import { setData } from '../../../redux/slices/nabancard';

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
    validatePickupDate,
  } = props;

  const { ccHolderName, ccNumber, ccExpiration, ccCVC, ccIssuer } = ccData;

  const recaptchaRef = useRef(null);
  const [recaptchaValue, setRecaptchaValue] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

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

  const handleCaptchaResponse = (response) => {
    setRecaptchaValue(response);
    setError(null);
  }

  const handleCaptchaExpired = (response) => {
    setRecaptchaValue('');
  }

  useEffect(() => {
    if (!recaptchaRef.current.innerHTML) {
      window.grecaptcha.render(recaptchaRef.current, {
        'callback' : handleCaptchaResponse,
        'expired-callback': handleCaptchaExpired,
      });
    }
  }, []);

  const resetCaptcha = () => {
    window.grecaptcha.reset();
    setRecaptchaValue('');
  }

  useEffect(() => {
    const velocitySuccessCallback = (data) => {
      resetCaptcha();
      onCardSubmitHandler(undefined, { nabancardData: JSON.parse(data) });
    }
  
    const velocityFailureCallback = (error) => {
      resetCaptcha();
      setError(JSON.parse(error).StatusMessage);
    }
      
    window.velocitySuccessCallback = velocitySuccessCallback;
    window.velocityFailureCallback = velocityFailureCallback;
  })

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!recaptchaValue) {
      setError('reCAPTCHA is required');
      return;
    }

    if (!validatePickupDate()) {
      return;
    }

    window.Velocity.sendPost()
  } 

  return (
    <form className="form cc"  onSubmit={handleSubmit} id="VelocityCheckoutForm">
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
          <label htmlFor="number" className="font-size-sm required">
            Card Number
          </label>

          <input
            type="tel"
            name="number"
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
            <label htmlFor="expiry" className="font-size-sm required">
              Valid Thru
            </label>

            <input
              type="tel"
              name="expiry"
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
          <input type="hidden" id="reCaptcha" name="Captcha" value={recaptchaValue} />
          
          <input type="hidden" name="issuer" value={issuer} />
          <input type="hidden" name="Expire" value={`${expMonth}${expYear}`} />
          <input type="hidden" name="PAN" data-cayan="cardnumber" value={cardNumber}/>

          <button type="submit" className="hidden">Presubmit</button>
        </div>

        <div 
          id="g-recaptcha" 
          ref={recaptchaRef}
          className="g-recaptcha" 
          data-sitekey={GOOGLE_RECAPTCHA_KEY}
        />

        {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
      </Card>
    </form>
  );
}