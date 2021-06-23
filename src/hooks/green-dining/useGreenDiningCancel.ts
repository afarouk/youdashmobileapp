import { useDispatch } from "react-redux";
import { removeDiscount as removeShoppingCartDiscount } from "../../redux/slices/shoppingCart";
import { removeDiscount as removeBusinessDataDiscount } from "../../redux/slices/business";
import { cancelGreenDiningBlock, cancelGreenDiningOrder } from "../../redux/slices/greenDiningSlice";
import { clearCart } from "../../redux/slices/shoppingCart";
import { useSelector } from "../../redux/store"
import { ORDERING_STATE } from "../../types/greenDining";
import { ROUTE_NAME, useRouting } from "../useRouting";

export const useGreenDiningCancel = () => {
  const dispatch = useDispatch();
  const { goTo } = useRouting();
  
  const orderingState = useSelector(state => state.greenDining.orderingState);
  const blockUUID = useSelector(state => state.greenDining.blockUUID);
  const discountUUID = useSelector(state => state.greenDining.discountUUID);

  const sendBackendCancellation = () => {
    if (blockUUID) { 
      dispatch(cancelGreenDiningBlock({
        blockUUID,
        discountUUID,
      }))
    }
  }

  // TODO: do we want to use it?
  const restartGreenDining = () => {
    if (orderingState === ORDERING_STATE.STARTED) {
      dispatch(clearCart());
      dispatch(removeBusinessDataDiscount(discountUUID));
      dispatch(removeShoppingCartDiscount(discountUUID));
      sendBackendCancellation();
    }

    goTo({ routeName: ROUTE_NAME.LANDING });
  }
  
  const cancelGreenDining = () => {
    if (orderingState === ORDERING_STATE.STARTED) {
      dispatch(clearCart());
      dispatch(removeBusinessDataDiscount(discountUUID));
      dispatch(removeShoppingCartDiscount(discountUUID));
      dispatch(cancelGreenDiningOrder());
      sendBackendCancellation();
    }

    if (orderingState === ORDERING_STATE.NOT_STARTED) {
      dispatch(cancelGreenDiningOrder());
    }

    goTo({ routeName: ROUTE_NAME.LANDING });
  }

  return { cancelGreenDining, sendBackendCancellation, restartGreenDining };
}