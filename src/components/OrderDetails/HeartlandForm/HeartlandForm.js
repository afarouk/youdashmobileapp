import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Spin } from 'antd';
import { Card } from '../../Shared/Card/Card';

import './HeartlandForm.css';
import { setFormFieldState } from '../../../redux/slices/creditCardPrestepForm';
import { setToken } from '../../../redux/slices/heartland';

export const HeartlandForm = (props) => {
  const { submitLabel, orderInProgress, onSubmit } = props;

  const cardForm = useRef(null)
  const formRef = useRef(null)
  const dispatch = useDispatch();
  const billingFormState = useSelector(state => state.creditCardPrestepForm.formState)
  const token = useSelector(state => state.heartland.token)
  const [errors, setErrors] = useState(null);

  const handleInputChange = ({ target }) => {
    let { name, value } = target;
    dispatch(setFormFieldState({ name, value }));
  };

  const sendOrder = (event = window.event) => {
    if (formRef.current.checkValidity()) {
      if (token) {
        onSubmit(event)
      }
    } else {
      formRef.current.reportValidity();
      dispatch(setToken(''));
    }
  }

  const handleSubmit = (event = window.event) => {
    event.preventDefault();

    sendOrder();
  }

  useEffect(() => {
    if (token) {
      sendOrder();
    }
  }, [token])

  useEffect(() => {

    // GlobalPayments.eCheck.form("#eCheck", { style: "blank" });
    cardForm.current = window.GlobalPayments.ui.form({
      fields: {
        // "card-holder-name": {
        //   placeholder: "Jane Smith",
        //   target: "#credit-card-card-holder"
        // },
        "card-number": {
          placeholder: "•••• •••• •••• ••••",
          target: "#credit-card-card-number"
        },
        "card-expiration": {
          placeholder: "MM / YYYY",
          target: "#credit-card-card-expiration"
        },
        "card-cvv": {
          placeholder: "•••",
          target: "#credit-card-card-cvv"
        },
        "submit": {
          value: submitLabel,
          target: "#credit-card-submit"
        }
      },
      styles: {
        'input': {
          'background-color': '#faf9ff',
          width: '100%',
          padding: '4px 11px',
          transition: 'all 0.3s',
          border: '1px solid #d9d9d9',
          'border-radius': '2px',
          'font-size': '14px',
          color: 'rgba(0, 0, 0, 0.85)',
          'box-sizing': 'border-box',
          'margin-bottom': '1em',
          'font-family': 'Poppins, sans-serif',
          outline: 'none',
          height: '32px',
        },
        'input:hover': {
          'border-color': '#40a9ff',
        },
        'input:focus': {
          'border-color': '#40a9ff',
          outline: 'none',
          'box-shadow': '0 0 0 2px rgb(24, 144, 255, 0.2)',
        },
        '.invalid, input.invalid, input.invalid:hover': {
          color: 'red',
          'border-color': 'red',
        },
        '.submit': {
          'line-height': '1.5715',
          'white-space': 'nowrap',
          'text-align': 'center',
          border: '1px solid #0097a7',
          'background-color': '#0097a7',
          'box-shadow': '0 2px 0 rgba(0, 0, 0, 0.015)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
          'touch-action': 'manipulation',
          height: '40px',
          padding: '6.4px 15px',
          'font-size': '14px',
          'border-radius': '2px',
          color: '#fff',
          'font-family': 'Poppins, sans-serif',
        }
      }

    });

    cardForm.current.on("token-success", (resp) => {
      setErrors(null);
      dispatch(setToken(resp.paymentReference));
    });

    cardForm.current.on("token-error", function (resp) {
      // An error occurred during tokenization
      if (resp.error) {
        setErrors(resp.reasons);
        console.log('token-error', resp);
      }
    });

    // TODO: add loggers here
    cardForm.current.on("error", (resp) => {
      console.log('error', resp)
    });
  }, [])

  return (
    <Card>
      <form onSubmit={handleSubmit} ref={formRef} className="heartland-form">
        <div className="form-row form-title">
          <h4 className="flex font-size-lg primary-text">
            <span>Enter details</span>
          </h4>
        </div>


        <div className="form-row">
          <div className="form-field">
            <label htmlFor="number" className="font-size-sm required">
              Card Number
          </label>

            <div className="heartland-iframe-field-wrapper" id="credit-card-card-number"></div>
          </div>
        </div>

        {/* <div className="form-field ant-form-item-has-error">
            <label htmlFor="name" className="font-size-sm required">
              Name
            </label>

            <div className="heartland-iframe-field-wrapper" id="credit-card-card-holder"></div>
          </div> */}

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="expiry" className="font-size-sm required">
              Valid Thru
            </label>

            <div className="heartland-iframe-field-wrapper" id="credit-card-card-expiration"></div>
          </div>

          <div className="divider-vertical"></div>

          <div className="form-field">
            <label htmlFor="cvc" className="font-size-sm required">
              CVC
            </label>

            <div className="heartland-iframe-field-wrapper" id="credit-card-card-cvv"></div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="zipCode" className="font-size-sm required">
              ZIP (United States)
              </label>

            <input
              type="text"
              name="zipCode"
              className={`ant-input`}
              placeholder="ZIP"
              value={billingFormState.zipCode}
              required
              onChange={handleInputChange}
            // onFocus={handleInputFocus}
            />
          </div>
        </div>

        {Array.isArray(errors) && errors.length > 0 && (
          <Alert
            style={{ marginBottom: '1em' }}
            message={errors.map(error => error.message).join(' ')}
            type="error"
          />
        )}

        <Spin spinning={orderInProgress} delay={10}>
          <div className="heartland-iframe-field-wrapper" id="credit-card-submit" />
        </Spin>

      </form>
    </Card>
  )
}