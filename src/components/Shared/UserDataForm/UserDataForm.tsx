import React, { useState } from 'react';
import QrReader from 'react-qr-reader'

import { Alert, Button, Input } from 'antd';
import InputMask from 'react-input-mask';
import { EditIcon } from '../Icons/Icons';
import keyTagImage from '../../../assets/images/key-tags-3-types.png';
import './UserDataForm.css';
import Modal from 'antd/lib/modal/Modal';
import { KEY_TAG_URL_PARAMETER } from '../../../config/constants';
import { KeyTagChangeEvent, User } from '../../../types/user';

type Props = {
  user: User,
  credentials: any,
  onChange: (event: React.ChangeEvent<HTMLInputElement> | KeyTagChangeEvent) => void,
  updateMode?: boolean,
  disabledFields?: string[],
  toggleUpdateMode?: (event: React.MouseEvent) => void,
  shouldChangeUpdateMode?: boolean,
}

export const UserDataForm: React.VFC<Props> = ({
  credentials,
  onChange,
  updateMode = false,
  user,
  disabledFields = [],
  toggleUpdateMode,
  shouldChangeUpdateMode = false,
}) => {

  const [scanError, setScanError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleScan = (data: any) => {
    if (!data || typeof data !== 'string') {
      return;
    }

    // data = 'https://chalkboardstoday.com/memqr?iid=105' // uncomment for testing

    try {
      const url = new URL(data);
      const searchParams = new URLSearchParams(url.search);

      const keyTag = searchParams.get(KEY_TAG_URL_PARAMETER);
      if (keyTag) {
        const changeEvent = new CustomEvent('keyTagChangeEvent', { 
          detail: {
            keyTagEvent: true,
            value: keyTag,
            name: 'kUID',
          }
        });

        onChange(changeEvent)
        setModalVisible(false);
      }
    } catch (error) {
      // TODO: do we want to show it to the user?
      console.log('scan url error', error);
    }
  }

  const handleError = (err: any) => {
    setScanError(true);
  }

  const kUIDValue = credentials.kUID || (user && user.kuid);


  const handleKeyTagClick = () => {
    if (kUIDValue) {
      return;
    }

    setModalVisible(true)
  }


  return (
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
          <InputMask 
            mask="(999) 999-9999" 
            value={credentials.mobile} 
            onChange={onChange}
            disabled={disabledFields.includes('mobile')}
          >
            {(inputProps: any) => (
              <Input
                {...inputProps}
                autoComplete="off"
                placeholder="Mobile number"
                name="mobile"
                required
                type="tel"
                disabled={disabledFields.includes('mobile')}
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
            Key-tag ID (scan)
          </label>

          <div className="key-tag-container">
            <Input
              autoComplete="off"
              placeholder="ID"
              name="kUID"
              value={kUIDValue}
              onChange={onChange}
              disabled={true}
            />
            <div className='key-tag-container__img-wrapper'>
              <img src={keyTagImage} alt="" onClick={handleKeyTagClick} />
            </div>
          </div>

        </div>
      </div>

      <Modal
        centered
        visible={modalVisible}
        onCancel={() => setModalVisible(false) }
        footer={null}
        bodyStyle={{ paddingTop: '3rem' }}
        style={{ borderRadius: '6px' }}
        maskClosable={false}
      >
        {scanError && (
          <Alert message="Error... Please check if camera access is given" type="error" showIcon style={{ marginBottom: '1rem' }} />
        )}

        {modalVisible && (
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
            
          />
        )}
        <Button
          style={{ margin: '1rem 0 0 auto', display: 'block' }}
          type="default"
          size="large"
          onClick={() => setModalVisible(false)}
          htmlType="button"
        >
          Close
        </Button>
      </Modal>
    </>
  );
}