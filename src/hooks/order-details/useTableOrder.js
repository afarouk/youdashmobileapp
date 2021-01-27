import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTablePath } from '../../redux/slices/shoppingCart';
import { message } from 'antd';
export default () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const tablePath = useSelector((state) => state.shoppingCart.tablePath);

  useEffect(() => {
    if (!tablePath) {
      let tableId = null;
      let zoneId = null;
      let levelId = null;
      const urlParams = new URLSearchParams(search);
      const type = urlParams.get('t');

      if (type && type === 't') {
        tableId = urlParams.get('tableId');
        zoneId = urlParams.get('zoneId');
        levelId = urlParams.get('levelId');
        if (tableId && levelId && zoneId) {
          dispatch(setTablePath(`${levelId}#${zoneId}#${tableId}`));
          message.success(
            <span
              onClick={() => message.destroy()}
            >{`You are ordering for Table # ${tableId}`}</span>,
            5
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablePath]);
};
