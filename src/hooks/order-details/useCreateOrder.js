import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useCalculateOrderPrice from './useCalculateOrderPrice';
import { formatOrderData, isToday, pad } from '../../utils/helpers';
import { clearCart, createOrder, resetOrderError } from '../../redux/slices/shoppingCart';
import { paymentProcessors } from '../../config/constants';

export default (businessData, user) => {
  const dispatch = useDispatch();
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const history = useHistory();

  const loyaltyAndOrderHistory = useSelector((state) => state.loyaltyAndOrderHistory.data);
  const [orderInProgress, setOrderInProgress] = useState(false);
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const orderRequestError = useSelector((state) => state.shoppingCart.error);
  const priceSubTotal = useSelector((state) => state.shoppingCart.priceSubTotal);
  const itemsWithDiscounts = useSelector((state) => state.shoppingCart.itemsWithDiscounts);
  const itemsWithGroupDiscounts = useSelector(
    (state) => state.shoppingCart.itemsWithGroupDiscounts
  );
  const orderPickUp = useSelector((state) => state.shoppingCart.orderPickUp);
  const tablePath = useSelector((state) => state.shoppingCart.tablePath);
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

  const handleCreateOrder = (newUser = null, transactionData = null) => {
    const {
      serviceAccommodatorId,
      serviceLocationId,
      catalogId,
      pickUp,
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

    if (pickUp && pickUp.futureDays && pickUp.futureDays.length) {
      let selectedDay = pickUp.futureDays.filter(
        ({ displayText }) => displayText === orderPickUp.day
      );
      if (selectedDay && selectedDay.length) {
        const { displayText, day, month, year } = selectedDay[0];
        requestedDeliveryDate = `${year}-${pad(month)}-${day}T${orderPickUp.time}:PDT`;
      }
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
      tablePath
    });

    switch (paymentProcessor) {
      case paymentProcessors.TSYS_ECOMMERCE:
        orderData = {
          ...orderData,
          paymentProcessor,
          provisioningParam1,
          provisioningParam2,
          provisioningParam3,
          provisioningParam4,
          provisioningParam5,
          processorParam1: transactionData.token,
        };
        break;
      default:
        orderData = {
          ...orderData,
          ...transactionData
        };
        break;
    }

    dispatch(createOrder(orderData))
    .then(({ payload, error }) => {
      if (payload && payload.orderUUID && !error) {
        dispatch(clearCart());
        history.push(`/${businessUrlKey}/order-status/${payload.orderUUID}${search}`);
      }
      if (error) {
        setOrderInProgress(false);
      }
    });

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
    handleCommentChange
  ];
};
