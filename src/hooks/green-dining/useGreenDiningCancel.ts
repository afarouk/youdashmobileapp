import { useDispatch } from "react-redux";
import { removeDiscount } from "../../redux/slices/business";
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
  
  const cancelGreenDining = () => {
    if (orderingState === ORDERING_STATE.STARTED) {
      dispatch(clearCart());
      dispatch(removeDiscount(discountUUID));
      dispatch(cancelGreenDiningOrder());
      sendBackendCancellation();
    }

    goTo({ routeName: ROUTE_NAME.LANDING });
  }

  return { cancelGreenDining, sendBackendCancellation };
}