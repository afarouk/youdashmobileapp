import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Card } from '../../Shared/Card/Card';
import { Alert, Button } from 'antd';

import './CreditCardPrestepForm.css';
import { setFormFieldState } from '../../../redux/slices/creditCardPrestepForm';
import { CreditCardPrestepData } from './CreditCardPrestepData';

// mode: 'edit' | 'preview'
export const CreditCardPrestepForm = ({ onSubmit, mode }) => {
  const formState = useSelector(state => state.creditCardPrestepForm.formState)
  const dispatch = useDispatch();

  const errors = {};

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit();
  }

  const handleInputChange = ({ target }) => {
    let { name, value } = target;
    dispatch(setFormFieldState({ name, value }));
  };

  if (mode === 'preview') {
    return <CreditCardPrestepData data={formState} />
  }

  return (
    <form className="credit-card-prestep-form" onSubmit={handleSubmit}>
      <Card>
        <div className="form-row form-title">
          <h4 className="flex font-size-lg primary-text">
            <span>Billing Address</span>
          </h4>
        </div>

        <div className="form-field">
          <label htmlFor="streetAddress" className="font-size-sm required">
            Street
          </label>

          <input
            type="text"
            name="streetAddress"
            className={`ant-input ${errors.street ? 'ant-input--error' : ''}`}
            placeholder="Street"
            required
            value={formState.streetAddress}
            onChange={handleInputChange}
            // onFocus={handleInputFocus}
          />
        </div>

        <div className="form-field ant-form-item-has-error">
          <label htmlFor="streetAddressDetails" className="font-size-sm required">
            Apt, Suite, Bldg(optional)
          </label>

          <input
            type="text"
            name="streetAddressDetails"
            className={`ant-input ${errors.cardholder ? 'ant-input--error' : ''}`}
            placeholder="Apt, Suite, Bldg(optional)"
            data-cayan="cardholder"
            value={formState.streetAddressDetails}
            onChange={handleInputChange}
            // onFocus={handleInputFocus}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="zipCode" className="font-size-sm required">
              ZIP (United States)
            </label>

            <input
              type="text"
              name="zipCode"
              className={`ant-input ${errors.expirationdate ? 'ant-input--error' : ''}`}
              placeholder="ZIP"
              value={formState.zipCode}
              required
              onChange={handleInputChange}
              // onFocus={handleInputFocus}
            />
          </div>

          <div className="divider-vertical"></div>

          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className="font-size-md submit-button"
          >Next</Button>
        </div>


      </Card>
    </form>
  )
}
