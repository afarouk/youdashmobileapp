import { useDispatch } from "react-redux";
import { removeDiscount as removeShoppingCartDiscount } from "../../redux/slices/shoppingCart";
import { removeDiscount as removeBusinessDataDiscount } from "../../redux/slices/business";
import { successGreenDiningOrder } from "../../redux/slices/greenDiningSlice";
import { clearCart } from "../../redux/slices/shoppingCart";
import { useSelector } from "../../redux/store"
import { ORDERING_STATE } from "../../types/greenDining";

export const useGreenDiningSuccess = () => {
  const dispatch = useDispatch();
  
  const orderingState = useSelector(state => state.greenDining.orderingState);
  const blockUUID = useSelector(state => state.greenDining.blockUUID);
  const discountUUID = useSelector(state => state.greenDining.discountUUID);

  const greenDiningSuccess = () => {
    if (orderingState === ORDERING_STATE.STARTED && blockUUID) {
      dispatch(clearCart());
      dispatch(removeBusinessDataDiscount(discountUUID));
      dispatch(removeShoppingCartDiscount(discountUUID));
      dispatch(successGreenDiningOrder());
    }
  }

  return { greenDiningSuccess };
}