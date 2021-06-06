import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';

import { setTableDetails } from '../../redux/slices/shoppingCart';

export default () => {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const tableDetails = useSelector((state) => state.shoppingCart.tableDetails);

  useEffect(() => {
    if (!tableDetails) {
      let tableId = null;
      let zoneId = null;
      let levelId = null;
      const urlParams = new URLSearchParams(search);
      const type = urlParams.get('t');

      // TODO: do we need this code, or should I use new parameter
      if (type && type === 't') {
        tableId = urlParams.get('tableId');
        zoneId = urlParams.get('zoneId');
        levelId = urlParams.get('levelId');
        if (tableId && levelId && zoneId) {
          dispatch(setTableDetails({
            tableId,
            zoneId,
            levelId,
          }));
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
  }, [tableDetails]);
};
