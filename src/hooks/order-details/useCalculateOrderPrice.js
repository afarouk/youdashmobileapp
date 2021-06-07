import { useEffect, useState } from 'react';
import { amountTypes } from '../../config/constants';
import { useLocation } from 'react-router-dom';
import { calculateDiscountedPrice, getPercent, floatNum } from '../../utils/helpers';

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
    if (businessData) {
      const urlParams = new URLSearchParams(search);
      const type = urlParams.get('t');
      const uuid = urlParams.get('u');
      const { discounts } = businessData;

      if (type && uuid) {
        const discountItem = discounts.filter(({ discountUUID }) => discountUUID === uuid)[0];
        if (discountItem) {
          const {
            discount,
            type,
            title,
            minimumPurchase,
            applicableItemUUID,
            applicableGroup
          } = discountItem;
          if (!applicableItemUUID && !applicableGroup) {
            setOrderDiscount({
              discount,
              type,
              title,
              minimumPurchase
            });
          }
        }
      }
    }
  }, [businessData]);

  useEffect(() => {
    const { discount, type, title, minimumPurchase } = orderDiscount;

    if (discount && priceSubTotal >= minimumPurchase && type) {
      setDiscountedPriceSubTotal(calculateDiscountedPrice(type, discount, priceSubTotal));
    } else {
      setDiscountedPriceSubTotal(priceSubTotal);
    }
  }, [priceSubTotal, orderDiscount]);

  useEffect(() => {
    setPriceTotal(
      floatNum(discountedPriceSubTotal + tips.percentValue + +extraFee.value + +taxes.value)
    );
  }, [tips]);

  useEffect(() => {
    let value = 0;
    let taxValue = 0;
    if (businessData.extraFees) {
      const { taxRate, extraFeeType, extraFeeValue = 0, extraFeeLabel } = businessData.extraFees;

      if (taxRate) {
        taxValue = getPercent(discountedPriceSubTotal + extraFeeValue, taxRate);
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
    setPriceTotal(floatNum(discountedPriceSubTotal + value + taxValue));
  }, [businessData.extraFees, discountedPriceSubTotal, shoppingCartItems]);

  return [
    priceTotal,
    discountedPriceSubTotal,
    orderDiscount,
    tips,
    taxes,
    extraFee,
    handleTipsChange
  ];
};
