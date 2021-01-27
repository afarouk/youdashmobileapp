import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { resetGlobalErrorMessage } from '../../redux/slices/globalError';
export default () => {
  const dispatch = useDispatch();
  const globalErrorMsg = useSelector((state) => state.globalError.errorMessage);
  const [msgInstance, setMsgInstance] = useState(null);
  useEffect(() => {
    if (globalErrorMsg) {
      message.error(
        <div onClick={() => dispatch(resetGlobalErrorMessage())}>
          An error has occurred. <br />
          <br /> {globalErrorMsg}
        </div>,
        5,
        () => {
          dispatch(resetGlobalErrorMessage());
          setMsgInstance(null);
        }
      );
      setMsgInstance(true);
    } else if (msgInstance && !globalErrorMsg) {
      message.destroy();
      setMsgInstance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalErrorMsg]);
};
