import { useEffect, useState } from 'react';
import { amountTypes, DISCOUNT_QUERY_PARAMETER_NAME, DISCOUNT_UUID_QUERY_PARAMETER_NAME } from '../../config/constants';
import { useLocation } from 'react-router-dom';
import { calculateDiscountedPrice, getPercent, floatNum } from '../../utils/helpers';
import { useSelector } from '../../redux/store';

export default (businessData, priceSubTotal, shoppingCartItems) => {
  const { search } = useLocation();
  const [priceTotal, setPriceTotal] = useState(0);
  const [discountedPriceSubTotal, setDiscountedPriceSubTotal] = useState(0);

  const [tips, setTips] = useState({
    value: 0,
    percentValue: 0
  });

  const [taxes, setTaxes] = useState({
    value: 0,
    percent: 0
  });
  const [extraFee, setExtraFee] = useState({
    value: 0,
    label: ''
  });
  const [orderDiscount, setOrderDiscount] = useState({
    discount: 0,
    type: '',
    title: '',
    minimumPurchase: 0
  });

  const priceSubtotalWithExtraFee = priceSubTotal + extraFee.value;

  const greenDiningCount = useSelector(state => state.greenDining.selectedCount)
  const discounts = useSelector(state => state.shoppingCart.discounts.byId)

  const handleTipsChange = (value) => {
    const totalBeforeTaxes = discountedPriceSubTotal + +(+extraFee.value);
    setTips({
      value: value ? value : 0,
      percentValue: value
        ? getPercent(totalBeforeTaxes, value)
        : 0
    });
  };

  useEffect(() => {
    if (discounts) {
      const urlParams = new URLSearchParams(search);
      const type = urlParams.get(DISCOUNT_QUERY_PARAMETER_NAME);
      const uuid = urlParams.get(DISCOUNT_UUID_QUERY_PARAMETER_NAME);

      if (type && uuid) {
        const discountItem = discounts[uuid];
        
        if (discountItem) {
          const {
            discount,
            type,
            title,
            minimumPurchase,
            applicableItemUUID,
            applicableGroup,
            expirationDate, // TODO: handle this case
            isGreenDiningDeal,
          } = discountItem;
          if (!applicableItemUUID && !applicableGroup) {
            setOrderDiscount({
              isGreenDiningDeal,
              discount,
              type,
              title,
              minimumPurchase
            });
          }
        }
      }
    }
  }, [discounts]);

  useEffect(() => {
    const { discount, type, title, minimumPurchase } = orderDiscount;

    if (discount && priceSubTotal >= minimumPurchase && type) {
      const discountedPrice = calculateDiscountedPrice({ 
        discountItem: orderDiscount, 
        price: priceSubTotal,
        greenDiningCount,
      });
      setDiscountedPriceSubTotal(discountedPrice + +extraFee.value);
    } else {
      setDiscountedPriceSubTotal(priceSubTotal + +extraFee.value);
    }
  }, [priceSubTotal, orderDiscount, extraFee]);

  useEffect(() => {
    setPriceTotal(
      floatNum(discountedPriceSubTotal + tips.percentValue + +taxes.value)
    );
  }, [tips]);

  useEffect(() => {
    let value = 0;
    let taxValue = 0;
    if (businessData.extraFees) {
      const { taxRate, extraFeeType, extraFeeValue = 0, extraFeeLabel } = businessData.extraFees;

      if (taxRate) {
        taxValue = getPercent(discountedPriceSubTotal, taxRate);
        setTaxes({
          value: taxValue,
          percent: taxRate
        });
      }

      switch (extraFeeType) {
        case amountTypes.PERCENT:
          if (discountedPriceSubTotal && extraFeeValue) {
            value = getPercent(discountedPriceSubTotal, extraFeeValue);
          }
          setExtraFee({
            value,
            label: extraFeeLabel
          });
          break;
        case amountTypes.AMOUNT:
          value = extraFeeValue;
          setExtraFee({
            value,
            label: extraFeeLabel
          });
          break;
        case amountTypes.EXACT:
          value = extraFeeValue;
          setExtraFee({
            value,
            label: extraFeeLabel
          });
          break;
      }
    }
    if (!shoppingCartItems.length) {
      setPriceTotal(0);
      setTips({ value: 0, percentValue: 0 });
      return;
    }
    setPriceTotal(floatNum(discountedPriceSubTotal + taxValue));
  }, [businessData.extraFees, discountedPriceSubTotal, shoppingCartItems]);

  return [
    priceTotal,
    discountedPriceSubTotal,
    orderDiscount,
    tips,
    taxes,
    extraFee,
    handleTipsChange,
    priceSubtotalWithExtraFee,
  ];
};
