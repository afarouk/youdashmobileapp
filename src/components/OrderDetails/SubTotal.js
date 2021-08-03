import React from 'react';
import PropTypes from 'prop-types';

export const SubTotal = ({
  priceSubTotal,
  discountedPriceSubTotal,
  orderDiscount,
  taxes,
  tips,
  extraFee,
  isCashPayment,
}) => {
  const hasDiscount =
    priceSubTotal !== discountedPriceSubTotal && orderDiscount && orderDiscount.discount;
  return (
    <div className="subtotal">
      {/*<h4 className="font-size-lg primary-text">Gross total</h4>*/}
      {extraFee.value ? (
        <h5 className="flex">
          <span>{extraFee.label ? extraFee.label : 'Extra Fee'}</span>
          <span>${extraFee.value.toFixed(2)}</span>
        </h5>
      ) : null}
      <div className="order-details__divider"></div>

      <h5 className="flex">
        <span>Sub-total</span>
        <span className={`subtotal-price ${hasDiscount ? 'subtotal-price-with-discount' : ''}`}>
          ${priceSubTotal.toFixed(2)}
        </span>
      </h5>
      {Boolean(hasDiscount) && (
        <h5 className={`flex discounted-text order-discount`}>
          <span>{orderDiscount.title}</span>
          <span>${discountedPriceSubTotal.toFixed(2)}</span>
        </h5>
      )}
      {taxes.value && taxes.percent ? (
        <h5 className="flex">
          <span>Taxes {taxes.percent}%</span>
          <span>${taxes.value.toFixed(2)}</span>
        </h5>
      ) : null}
      {!isCashPayment && (
        <h5 className="flex">
          <span className="bold">Tip {tips.value}%</span>
          <span className="bold">${tips.percentValue.toFixed(2)}</span>
        </h5>
      )}
    </div>
  );
};

SubTotal.propTypes = {
  subTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  taxes: PropTypes.object,
  extraFee: PropTypes.object,
  tips: PropTypes.object
};
