import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { CARD_CONNECT_IFRAME_URL, CARD_CONNECT_TOKEN_KEY } from '../../../config/constants';
import { setToken } from '../../../redux/slices/cardConnectIframe';
import { Alert, Button } from 'antd';

import { Card } from '../../Shared/Card/Card';

export const CardConnectIframe = React.memo((props) => {
  const { submitLabel, orderInProgress, onSubmit } = props;

  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const token = useSelector(state => state.cardConnectIframe.token);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Something is wrong, please check card details and try again');
    } else {
      onSubmit(event);
    }
  }

  const handleToken = useCallback((event) => {
    if (event.origin !== CARD_CONNECT_IFRAME_URL) {
      return;
    }

    try {
      const data = JSON.parse(event.data);
      if (CARD_CONNECT_TOKEN_KEY in data) {
        dispatch(setToken(data[CARD_CONNECT_TOKEN_KEY]));
      }
    } catch (error) {
      // silent
    }

  }, [dispatch])
  

  useEffect(() => {
    window.addEventListener('message', handleToken)

    return () => window.removeEventListener('message', handleToken)
  }, [handleToken])

  const cssStyles = [
    'input[name="ccnumfield"], #cccvvfield{background-color: #faf9ff;width:100%;padding: 4px 11px;transition: all 0.3s;border:1px solid #d9d9d9;border-radius:2px;font-size: 14px;color: rgba(0, 0, 0, 0.85);box-sizing: border-box;margin-bottom: 1em;}',
    'input[name="ccnumfield"].error, #cccvvfield.error{color: red;border-color: red;}',
    'input[name="ccnumfield"]:hover{border-color: #40a9ff;}',
    'input[name="ccnumfield"]:focus{border-color: #40a9ff;outline:none;box-shadow: 0 0 0 2px rgb(24, 144, 255, 0.2)}',
    '#cccvvfield{width: 100px;}',
    'body{margin: 0;font-family: Poppins, sans-serif;}',
    'label{font-size: 0.8rem;line-height: 22.6px;}',
    'select{width: 30%;margin-bottom: 1em;}'
  ]

  const config = {
    autofocus: true,
    cardnumbernumericonly: true,
    enhancedresponse: true,

    invalidcreditcardevent: true,
    invalidcvvevent: true,
    invalidexpiryevent: true,
    invalidinputevent: true,

    tokenizewheninactive: true,
    
    tokenpropname: CARD_CONNECT_TOKEN_KEY,

    placeholdercvv: 'CVV',
    // placeholdermonth,
    // placeholderyear,

    usecvv: true,
    useexpiry: true,
    // useexpiryfield: true,

    css: cssStyles.join(''),
  }

  


  let urlParams = (new URLSearchParams(config)).toString();

  urlParams += '&placeholder=Card%20Number';

  return (
    <Card>
      <form name="tokenform" id="tokenform" onSubmit={handleSubmit}>
        <iframe id="tokenFrame" style={{ width: '100%', height: '175px' }} name="tokenFrame" src={`${CARD_CONNECT_IFRAME_URL}/itoke/ajax-tokenizer.html?${urlParams}`} frameBorder="0" scrolling="no"></iframe>

        {error && (
          <Alert 
            style={{ marginBottom: '1em' }}
            message={error}
            type="error"
          />
        )}

        <Button
          block
          size="large"
          type="primary"
          className="font-size-md"
          htmlType="submit"
          loading={orderInProgress}
        >
          {submitLabel}
        </Button>
      </form>
    </Card>
  )
})