import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';

import { REORDER_CONFIG } from "../../config/constants";
import { useSelector } from '../../redux/store';
import { orderAPI } from "../../services/api";
import { reorderItems } from './useReorder';

export const useReorderFromUrl = () => {
  const dispatch = useDispatch();
  const businessData = useSelector(state => state.business.data);
  const alreadyFetched = useRef(false);

  useEffect(() => {
    const businessDataLoaded = Boolean(businessData && businessData.serviceAccommodatorId)

    if (!businessDataLoaded || alreadyFetched.current) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const isReorder = params.get(REORDER_CONFIG.QUERY_PARAMETER) === REORDER_CONFIG.PARAMETER_VALUE;
    const orderUuid = params.get(REORDER_CONFIG.ORDER_UUID_QUERY_PARAMETER_NAME);
    const catalogId = params.get(REORDER_CONFIG.CATALOG_ID_QUERY_PARAMETER_NAME);

    if (!isReorder || !orderUuid || !catalogId) return;
    if (catalogId !== businessData.catalogs[0].catalogId) return;

    const fetchOrderData = async () => {
      try {
        const { data } = await orderAPI.getOrderByUuid({ uuid: orderUuid });

        if (data && data.items) {
          reorderItems(data.items, businessData, dispatch);
        }
      } catch (e) {
        // fail silently
        console.log(e)
      }
    }

    fetchOrderData();
    
    alreadyFetched.current = true;
  }, [businessData])

}