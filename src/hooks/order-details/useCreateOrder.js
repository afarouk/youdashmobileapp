import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useCalculateOrderPrice from './useCalculateOrderPrice';
import { formatOrderData, isToday, pad, toIsoString } from '../../utils/helpers';
import { clearCart, createOrder, resetOrderError, setCheckoutMode } from '../../redux/slices/shoppingCart';
import { CHECKOUT_MODE, PAYMENT_PROCESSOR } from '../../config/constants';
import { getLoyaltyAndOrderHistory } from '../../redux/slices/loyaltyAndOrderHistory';

export default (businessData, user) => {
  const dispatch = useDispatch();
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const history = useHistory();

  const loyaltyAndOrderHistory = useSelector((state) => state.loyaltyAndOrderHistory.data);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const orderRequestError = useSelector((state) => state.shoppingCart.error);
  const orderRequestErrorMessage = useSelector((state) => state.shoppingCart.errorMessage);
  const paymentTokenError = useSelector((state) => state.shoppingCart.paymentTokenError);
  const priceSubTotal = useSelector((state) => state.shoppingCart.priceSubTotal);
  const itemsWithDiscounts = useSelector((state) => state.shoppingCart.itemsWithDiscounts);
  const itemsWithGroupDiscounts = useSelector(
    (state) => state.shoppingCart.itemsWithGroupDiscounts
  );
  const orderPickUp = useSelector((state) => state.shoppingCart.orderPickUp);
  const tablePath = useSelector((state) => state.shoppingCart.tablePath);
  const billingAddress = useSelector(state => state.creditCardPrestepForm.formState);
  const [comment, setComment] = useState('');
  const handleCommentChange = (e) => setComment(e.target.value);
  const [
    priceTotal,
    discountedPriceSubTotal,
    orderDiscount,
    tips,
    taxes,
    extraFee,
    onTipsChange
  ] = useCalculateOrderPrice(businessData, priceSubTotal, shoppingCartItems);

  const handleResetOrderError = () => dispatch(resetOrderError());

  const handleCreateOrder = async({
    newUser = null,
    transactionData = null, // iframe data
    creditCardData = null, // custom credit card data
    nextOrderData = null,
  } = {}) => {
    const {
      serviceAccommodatorId,
      serviceLocationId,
      catalogId,
      pickUp,
      extraFees,
      promotions,
      onlineOrder: {
        paymentProcessor,
        provisioningParam1,
        provisioningParam2,
        provisioningParam3,
        provisioningParam4,
        provisioningParam5
      }
    } = businessData;

    let requestedDeliveryDate = '';

    if (orderPickUp && orderPickUp.date && orderPickUp.time) {
      const orderPickUpDate = new Date(orderPickUp.date);
      const [hours, minutes] = orderPickUp.time.split(':');
      orderPickUpDate.setHours(hours, minutes);
      
      requestedDeliveryDate = toIsoString(orderPickUpDate);
    }

    let orderData = formatOrderData({
      comment: comment ? comment : null,
      loyaltyStatus: loyaltyAndOrderHistory?.loyaltyForUser?.loyaltyStatus,
      items: shoppingCartItems,
      itemsWithDiscounts,
      itemsWithGroupDiscounts,
      user: newUser ? newUser : user,
      serviceAccommodatorId,
      serviceLocationId,
      catalogId,
      priceSubTotal,
      deliveryType: orderPickUp.deliveryType,
      requestedDeliveryDate,
      futureOrRegular: isToday(orderPickUp.day) ? 'REGULAR' : 'FUTURE',
      //prices
      subTotal: priceSubTotal,
      tipAmount: tips,
      taxAmount: taxes.value,
      totalAmount: priceTotal,
      tablePath,
      transactionData,
      creditCardData,
      nextOrderData,
      calculatedExtraFeeValue: extraFee.value,
      extraFees,
      promotions,
      billingAddress,
    });
    
    switch (paymentProcessor) {
      case PAYMENT_PROCESSOR.TSYS_ECOMMERCE:
      case PAYMENT_PROCESSOR.CARDCONNECT_ECOMMERCE:
        orderData = {
          ...orderData,
          paymentProcessor,
          provisioningParam1,
          provisioningParam2,
          provisioningParam3,
          provisioningParam4,
          provisioningParam5,
        };
        break;
      case PAYMENT_PROCESSOR.VANTIV_ECOMMERCE:
        orderData = {
          ...orderData,
        };
        break;
      default:
        orderData = {
          ...orderData,
          ...transactionData,
        };
    }

    await dispatch(createOrder(orderData))
      .then(({ payload, error }) => {
        if (payload && payload.orderUUID && !error) {
          dispatch(clearCart());
          history.push(`/${businessUrlKey}/order-status/${payload.orderUUID}${search}`);
          if (user) {
            dispatch(getLoyaltyAndOrderHistory({
              UID: user.uid,
              serviceAccommodatorId,
              serviceLocationId,
            }))
          }
        }
        if (error) {
          if (paymentProcessor === PAYMENT_PROCESSOR.CARDCONNECT_ECOMMERCE) {
            dispatch(setCheckoutMode(CHECKOUT_MODE.CARD_PAYMENT_PRESTEP));
          }
          setOrderInProgress(false);
        }
      });

      setOrderInProgress(false)
  };
  return [
    orderInProgress,
    setOrderInProgress,
    shoppingCartItems,
    handleCreateOrder,
    handleResetOrderError,
    priceTotal,
    discountedPriceSubTotal,
    orderDiscount,
    tips,
    taxes,
    extraFee,
    onTipsChange,
    orderPickUp,
    priceSubTotal,
    orderRequestError,
    comment,
    handleCommentChange,
    paymentTokenError,
  ];
};
