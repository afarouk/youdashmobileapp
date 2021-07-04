import { MouseEventHandler, useEffect } from "react";
import { useDispatch } from "react-redux";
import times from 'lodash/times';

import { GREEN_DINING_BLOCK_DURATION_SEC } from "../../config/constants";

import { useSelector } from "../../redux/store";
import { blockGreenDiningOrder, resetBlocOrderkError, setSelectedCount, startGreenDiningOrdering } from "../../redux/slices/greenDiningSlice";
import { addDiscount } from "../../redux/slices/business";
import { useReorder } from "../order-details/useReorder";
import { ROUTE_NAME, useRouting } from "../useRouting";
import { clearCart } from "../../redux/slices/shoppingCart";
import { ORDERING_STATE } from "../../types/greenDining";
import { getReadableTime } from "../../utils/helpers";

export const useGreenDining = () => {
  const dispatch = useDispatch();
  const { reorderItems } = useReorder();
  const { goTo } = useRouting();

  const greenDiningInfo = useSelector(state => state.greenDining.data);
  const blockUUID = useSelector(state => state.greenDining.blockUUID);
  const orderingState = useSelector(state => state.greenDining.orderingState);
  const selectedCount = useSelector(state => state.greenDining.selectedCount);
  const loading = useSelector(state => state.greenDining.blockOrderLoading);
  const error = useSelector(state => state.greenDining.blockOrderError);
  const errorMessage = useSelector(state => state.greenDining.blockOrderErrorMessage);

  const souuid = useSelector(state => state.greenDining.souuid);
  const discountUUID = useSelector(state => state.greenDining.discountUUID);

  let timeZone = useSelector(state => state.business.data.pickUp.address.timeZone);
  const pickUpTime = greenDiningInfo && getReadableTime({
    hours: greenDiningInfo.pickupDayTime.times[0].hour,
    minutes: greenDiningInfo.pickupDayTime.times[0].minute,
    timeZone,
  })

  useEffect(() => {
    if (blockUUID && greenDiningInfo && orderingState === ORDERING_STATE.NOT_STARTED) {
      dispatch(startGreenDiningOrdering());
      dispatch(clearCart());
      dispatch(addDiscount(greenDiningInfo.discountMetaData));

      const items: any[] = [];
      times(selectedCount, () => {
        items.push(...greenDiningInfo.sampleOrder.items);
      })
      
      reorderItems(items);
      goTo({ routeName: ROUTE_NAME.CART });
    }
  }, [blockUUID, orderingState])

  const maxCount = greenDiningInfo?.lastAvailableCount || 0

  const handleBuyClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    dispatch(resetBlocOrderkError());

    dispatch(blockGreenDiningOrder({
      blockCount: selectedCount,
      blockDurationSeconds: GREEN_DINING_BLOCK_DURATION_SEC,
      discountUUID,
      souuid,
    }))
  }

  const handleMore = () => {
    if (selectedCount < maxCount) {
      dispatch(setSelectedCount(selectedCount + 1));
    }
  }

  const handleLess = () => {
    if (selectedCount > 1) {
      dispatch(setSelectedCount(selectedCount - 1));
    }
  }

  const resetError = () => {
    dispatch(resetBlocOrderkError())
  }

  return {
    selectedCount,
    handleMore,
    handleLess,
    greenDiningInfo,
    loading,
    error,
    errorMessage,
    handleBuyClick,
    resetError,
    pickUpTime,
  }
}