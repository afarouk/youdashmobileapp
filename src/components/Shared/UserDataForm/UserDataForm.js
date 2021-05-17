import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import InputMask from 'react-input-mask';
import { EditIcon } from '../Icons/Icons';
import keyTagImage from '../../../assets/images/key-tags-3-types.png';
import './UserDataForm.css';

export const UserDataForm = ({
  credentials,
  onChange,
  updateMode,
  user,
  toggleUpdateMode,
  shouldChangeUpdateMode = false
}) => (
  <>
    {user && updateMode && (
      <h4 className="flex font-size-lg primary-text">
        <span>How will we contact you?</span>
        {toggleUpdateMode && (
          <span onClick={toggleUpdateMode}>
            <EditIcon />
          </span>
        )}
      </h4>
    )}
    <div className="user-data-form">
      <div>
        <label htmlFor="firstName" className="font-size-sm required-field">
          Name to call
        </label>
        <Input
          autoComplete="off"
          placeholder="Name to call"
          name="firstName"
          required
          value={credentials.firstName}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="userName" className="font-size-sm required-field">
          Mobile phone number
        </label>
        <InputMask mask="(999) 999-9999" value={credentials.mobile} onChange={onChange}>
          {(inputProps) => (
            <Input
              {...inputProps}
              autoComplete="off"
              placeholder="Mobile number"
              name="mobile"
              required
              type="tel"
            />
          )}
        </InputMask>
      </div>
      <div>
        <label htmlFor="email" className="font-size-sm required-field">
          E-mail
        </label>
        <Input
          placeholder="E-mail"
          name="email"
          type="email"
          required
          onChange={onChange}
          autoComplete="off"
          value={credentials.email}
        />
      </div>
      <div>
        <label htmlFor="firstName" className="font-size-sm">
          Key-tag ID (optional)
        </label>
        <div className='key-tag-container'>
          <Input
            autoComplete="off"
            placeholder="ID"
            name="kUID"
            value={credentials.kUID}
            onChange={onChange}
          />
          <div className='key-tag-container__img-wrapper'><img src={keyTagImage} alt="" /></div>
        </div>
      </div>
    </div>
  </>
);

UserDataForm.propTypes = {
  onChange: PropTypes.func.isRequired
};
