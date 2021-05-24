import React, { useState, useEffect, useRef } from 'react';
import {default as CC} from "react-credit-cards";
// import { Input } from 'antd';
import { Card } from '../Shared/Card/Card';

// import "react-credit-cards/es/styles-compiled.css";
// import './Creditcard.scss';
import './Creditcard.css';
import './CreditcardForm.css';

export default function CreditcardForm({
  isResolved,
  isIframePayment,
  ccData,
  issuer,
  formState,
  focused,
  handleCallback,
  handleInputFocus,
  handleInputChange,
  onCardSubmitHandler,
  priceTotal,
  paymentTokenFieldsErrors,
}) {
  const formRef = useRef(null);
  const { ccHolderName, ccNumber, ccExpiration, ccCVC, ccIssuer } = ccData;

  // 4012 0000 3333 0026
  // 12/25    123

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

  const errors = (paymentTokenFieldsErrors || []).reduce((acc, err) => {
    acc[err.reason] = err.error_code;
    return acc;
  }, {})

  return (

    <form className="form cc" ref={formRef} onSubmit={onCardSubmitHandler}>
      <Card>
        <div className="form-row form-title">
          <h4 className="flex font-size-lg primary-text">
            <span>Enter details</span>
            {/*<span onClick={toggleUpdateMode}><EditIcon /></span>*/}
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
            className={`ant-input ${errors.cardnumber ? 'ant-input--error' : ''}`}
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
            className={`ant-input ${errors.cardholder ? 'ant-input--error' : ''}`}
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
              className={`ant-input ${errors.expirationdate ? 'ant-input--error' : ''}`}
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
              CVC
            </label>

            <input
              type="tel"
              name="cvc"
              className={`ant-input ${errors.cvv ? 'ant-input--error' : ''}`}
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              data-cayan="cvv"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>

        <div className="form-field">
          <input type="hidden" name="issuer" value={issuer} />
          <input type="hidden" name="total" data-cayan="amount" value={priceTotal}/>
          <input type="hidden" name="expirationmonth" data-cayan="expirationmonth" value={expMonth}/>
          <input type="hidden" name="expirationyear" data-cayan="expirationyear" value={expYear}/>
          <input type="hidden" name="cardnumber" data-cayan="cardnumber" value={cardNumber}/>

          <button type="submit" className="hidden">Presubmit</button>
        </div>


      </Card>
    </form>
  );
}
