import { amountTypes, discountTypes, PAYMENT_PROCESSOR, PAYMENT_TOKEN_ERROR } from '../config/constants';

export const handleNativeShare = async (shareData) => {
  if (navigator.share !== undefined) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share failed.');
    }
  }
};

export const scrollToElement = (el, offset = 80) => {
  if (typeof window !== 'undefined' && window.scrollTo) {
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y - offset, behavior: 'smooth' });
    }
  }
};

export const toIsoString = (date) => {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
          var norm = Math.floor(Math.abs(num));
          return (norm < 10 ? '0' : '') + norm;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
}

export const formatDeliveryDate = (dateLike) => {
  return Object.prototype.toString.call(dateLike) === '[object Date]'
    ? `${dateLike.getFullYear()}.${pad(dateLike.getMonth() + 1)}.${pad(dateLike.getDate())}`
    : `${dateLike.year}.${pad(dateLike.month)}.${pad(dateLike.day)}`
} 

export const addLeadingZero = (time) => (time === 0 ? '00' : time);

export const getQueryStringParams = () => new URLSearchParams(window.location.search);
export const getMediaImageUrl = (mediaURLs) => (mediaURLs && mediaURLs[0] ? mediaURLs[0] : null);

export const formatAddress = ({ city, country, number, state, street, timeZone, locale, zip }) =>
  `${number} ${street}, ${city}, ${state} ${zip}`;

export const formatGMapAddress = ({
  city,
  country,
  number,
  state,
  street,
  timeZone,
  locale,
  zip
}) => `${number}+${street}+${city}+${state}+${zip}`;

export const pad = (n) => (n < 10 ? '0' + n : `${n}`);

export const getDayNameByIndex = (index) =>
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][index];
export const isToday = (date) => {
  const today = new Date();
  return date === formatDeliveryDate(today);
};

export const splitDateString = (date) => {
  return date.split('.').map((strNum) => parseInt(strNum));
}

export const changeTimezone = (date, timeZone) =>
  new Date(
    date.toLocaleString('en-US', {
      timeZone: timeZone
    })
  );

export const getPercent = (total, value) => roundToTwoPlaces((total * value) / 100);

export const calculateDiscountedPrice = ({ discountItem, price, greenDiningCount = 0 }) => {
  const { type, discount, isGreenDiningDeal } = discountItem
  switch (type) {
    case amountTypes.PERCENT:
      const result = price - getPercent(price, discount);
      return result > 0 ? result : 0;
    case amountTypes.AMOUNT:
      const totalDiscount = isGreenDiningDeal
        ? greenDiningCount * discount
        : discount;

      return price > totalDiscount ? price - totalDiscount : 0;
    case amountTypes.EXACT:
      return discount;
  }
};

const itemShape = {
  itemId: 1,
  itemVersion: 1,
  priceId: 1,
  quantity: 1.0,
  comment: '',
  groupId: '',
  catalogId: '',
  intraOrderAssociationTag: null,
  intraOrderQuantity: null,
  wasCustomized: false,
  customizedPrice: null, //TODO: set
  discountedPrice: null, //TODO: set
  serviceAccommodatorId: '',
  serviceLocationId: '',
  userSASLid: null,
  deliveryType: 'PICK_UP',
  itemOptions: null,
  itemDate: null,
  status: 'INITIALIZED',
  delayedFire: false,
  hint: '',
  finalPriceCharged: 0, //TODO: set
  compPrice: null,
  invoiceType: null,
  invoiceStatus: null,
  itemizedTax: null,
  ageVerified: null,
  cartEntryId: null,
  sentTimeToKitchen: null
};

const mapTransactionData = (transactionData) => ({
  paymentProcessor: transactionData.paymentProcessor,
  cashSelected: false,
  creditCardSelected: true,
  orderUUID: transactionData.transactionSetup.orderUUID,
  orderId: transactionData.transactionSetup.orderId,
  cyclicOrderIdInt: transactionData.transactionSetup.cyclicOrderId,
  transactionId1: transactionData.hostedPaymentStatus,
  transactionId2: transactionData.transactionID,
  transactionId3: transactionData.expressResponseCode,
  transactionId4: transactionData.expressResponseMessage,
  transactionId5: transactionData.CVVResponseCode,
  transactionId6: transactionData.approvalNumber,
  transactionId7: transactionData.lastFour,
  transactionId8: transactionData.cardLogo,
  transactionId9: transactionData.approvedAmount
});

const prepareCreditCardData = (creditCardData) => ({
  processorParam1: creditCardData.token,
  cashSelected: false,
  creditCardSelected: true,
  processorParam2: null,
  processorParam3: null,
  processorParam4: null,
  processorParam5: null,
})

const prepareNabancardData = (nabancardData) => ({
  transactionId1: nabancardData.Status,
  transactionId2: nabancardData.TransactionId,
  transactionId3: "Web",
  transactionId4: "AID",
  transactionId5: "Cryptogram",
  transactionId6: nabancardData.ApprovalCode,
  transactionId7: nabancardData.MaskedPAN,
  transactionId8: nabancardData.CardType,
  transactionId9: nabancardData.Amount,
  transactionId10: "false",
  transactionId11: "APP Preferred Name",
  transactionId12: "Tip",
  transactionId13: "SANDF",
  transactionId14: "false",
  transactionId15: null,
  transactionId16: null,
  transactionId17: null,
  transactionId18: null,
  transactionId19: null,
  transactionId20: null
})

const getDiscounts = ({
  discountsById,
  itemsWithDiscounts,
  itemsWithGroupDiscounts,
}) => {
  const discounts = [];

  // handle items discounts
  if (itemsWithDiscounts) {
    Object.values(itemsWithDiscounts).forEach((customDiscountItem) => {
      const { discountType, priceItem, ...discountItem } = customDiscountItem;
      discounts.push(discountItem);
    });
  }

  // handle group discounts
  if (itemsWithGroupDiscounts) {
    Object.values(itemsWithGroupDiscounts).forEach((customDiscountItem) => {
      if (customDiscountItem.discountType === discountTypes.GROUP_DISCOUNT) {
        const { discountType, ...discountItem } = customDiscountItem;
        discounts.push(discountItem);
      }
    });
  }

  // handle other discounts
  if (discountsById) {
    Object.values(discountsById).forEach(customDiscountItem => {
      const { discountType, ...discountItem } = customDiscountItem;
      if (!discountItem.applicableItemUUID && !discountItem.applicableGroup) {
        discounts.push(discountItem);
      }
    })
  }

  return discounts.length ? discounts : null;
}

export const formatOrderData = ({
  comment,
  loyaltyStatus,
  items,
  itemsWithDiscounts,
  itemsWithGroupDiscounts,
  user,
  catalogId,
  serviceAccommodatorId,
  serviceLocationId,
  deliveryType,
  futureOrRegular,
  requestedDeliveryDate,
  subTotal,
  totalAmount,
  tipAmount,
  taxAmount,
  tablePath,
  transactionData,
  creditCardData,
  nextOrderData,
  extraFees,
  calculatedExtraFeeValue,
  promotions,
  billingAddress,
  acceptCash,
  acceptCreditCards,
  discountsById,
  isGreenDiningOrder,
}) => {
  let authorizationsAndDiscounts = getAuthorizationsAndDsicounts({
    discountsById,
    itemsWithDiscounts,
    itemsWithGroupDiscounts,
    loyaltyStatus,
  })
  
  
  
  let transactionDataFields = {};
  if (transactionData) {
    transactionDataFields = mapTransactionData(transactionData);
  }

  let creditCardDataFields;
  if (creditCardData) {
    creditCardDataFields = creditCardData.paymentProcessor === PAYMENT_PROCESSOR.NABANCARD_ECOMMERCE 
      ? prepareNabancardData(creditCardData.nabancardData)
      : prepareCreditCardData(creditCardData);
  }

  let nextOrderDataFields;
  if (nextOrderData) {
    nextOrderDataFields = {
      orderUUID: nextOrderData.orderUUID,
      orderId: nextOrderData.idOrder,
      cyclicOrderIdInt: nextOrderData.cyclicOrderIdInt,
    }
  }

  let orderShape = {
    userName: null,
    userLevel: null,
    adhoc: false,
    tablePath,
    items: items.map((item) => {
      const {
        itemId,
        itemVersion,
        priceId,
        quantity,
        comments,
        groupId,
        itemOptions,
        price,
        discountedPrice
      } = item;
      return {
        ...itemShape,
        itemId,
        finalPriceCharged: discountedPrice !== undefined ? discountedPrice : price,
        discountedPrice: discountedPrice,
        itemVersion:
          itemVersion && typeof itemVersion === 'object'
            ? JSON.stringify(itemVersion)
            : itemVersion,
        quantity,
        comment: comments,
        groupId,
        itemOptionsString: itemOptions ? JSON.stringify(itemOptions) : null,
        catalogId,
        serviceAccommodatorId,
        serviceLocationId
      };
    }),
    authorizationsAndDiscounts: authorizationsAndDiscounts,
    deliveryType,
    futureOrRegular,
    deliveryContactName: null,
    deliveryPhone: null,
    deliveryEmail: null,
    deliveryAddress: null,
    requestedDeliveryDate: requestedDeliveryDate,
    orderType: 'UNDEFINED',
    firstName: user ? user.firstName : null,
    lastName: null,
    comment: comment,
    orderId: null,
    cyclicOrderIdInt: null,
    orderUUID: null,
    tagORTableNumber: null,
    customerEnteredName: null,
    customerEnteredMobile: null,
    serviceAccommodatorId: serviceAccommodatorId,
    serviceLocationId: serviceLocationId,
    pickupSelected: true,
    deliverySelected: false,
    levelId: null,
    zoneId: null,
    tableId: null,
    pagerDetails: null,
    secretComment: null,
    stationId: null,
    subTotal: subTotal ? subTotal : 0.0,
    tipAmount: tipAmount ? tipAmount.percentValue : 0.0,
    taxAmount: taxAmount ? taxAmount : 0.0,
    totalAmount: totalAmount ? totalAmount : 0.0,
    pricePaid: totalAmount ? (transactionData ? totalAmount : -Math.abs(totalAmount)) : 0.0,
    invoicePaid: transactionData ? totalAmount : 0.0,
    invoiceTotal: 0.0,
    invoiceClaimed: 0.0,
    compPrice: 0.0,
    currencyCode: 'USD',
    //CC
    v_acceptorId: null,
    v_accountId: null,
    v_accountToken: null,
    vantivReturnURL: null,
    vantivCSS: null,
    maskedAccountNumber: null,
    cardHolderName: null,
    invoiceId: null,
    paymentDetails1: null,
    paymentDetails2: null,
    paymentDetails3: null,
    paymentDetails4: null,
    paymentDetails5: null,
    transactionId1: null,
    transactionId2: null,
    transactionId3: null,
    transactionId4: null,
    transactionId5: null,
    transactionId6: null,
    transactionId7: null,
    transactionId8: null,
    transactionId9: null,
    transactionId10: null,
    transactionId11: null,
    transactionId12: null,
    transactionId13: null,
    transactionId14: null,
    transactionId15: null,
    transactionId16: null,
    transactionId17: null,
    transactionId18: null,
    transactionId19: null,
    transactionId20: null,
    saveCreditCardForFutureReference: null, //TODO: later bool
    fundSourceId: null,
    invoiceStatus: 'UNDEFINED',
    cashSelected: acceptCash,
    creditCardSelected: acceptCreditCards,
    creditCard: null,
    billingAddress: prepareBillingAddress(billingAddress),
    paymentProcessor: 'UNDEFINED',
    cardReaderType: 'UNDEFINED',
    invoiceType: null,
    cashTendered: null,
    idAdhocOrderInvoiceParent: null,
    userSASLid: null,
    uid: user ? user.uid : null,
    isGreenDiningOrder,
    calculatedExtraFeeValue,
    ...transactionDataFields,
    ...creditCardDataFields,
    ...nextOrderDataFields,
    ...prepareExtraFeeFields(extraFees),
  };
  return orderShape;
};

const getAuthorizationsAndDsicounts = ({
  discountsById,
  itemsWithDiscounts,
  itemsWithGroupDiscounts,
  loyaltyStatus,
}) => {
  let discounts = getDiscounts({
    discountsById,
    itemsWithDiscounts,
    itemsWithGroupDiscounts,
  })

  let loyaltyActive = false;
  if (loyaltyStatus && discounts) {
    const loaltyDiscount = discounts.find(discount => discount.discountUUID === loyaltyStatus.loyaltyUUID)

    if (loaltyDiscount) {
      discounts = discounts.filter(discount => discount.discountUUID !== loyaltyStatus.loyaltyUUID)
      loyaltyActive = true;
    }
  }

  return {
    authorizations: null,
    discounts: discounts && discounts.length > 0 ? discounts : null,
    loyaltyStatus: loyaltyActive ? loyaltyStatus : null,
    promotions: null,
    // promotions: promotions,
    // loyaltyStatus: loyaltyStatus,
  };
}

const prepareExtraFeeFields = ({
  addExtraFeeToTotalAmount,
  extraFeeLabel,
  extraFeeDisplayLabel,
  extraFeeType,
  extraFeeValue,
  taxRate,
}) => {
  return {
    addExtraFeeToTotalAmount,
    extraFeeLabel,
    // extraFeeDisplayLabel: extraFeeLabel,
    extraFeeType,
    extraFeeValue,
    taxRate,
  }
}

const prepareBillingAddress = (billingAddress) => {
  if (!billingAddress) {
    return null;
  }

  return {
    zip: billingAddress.zipCode,
    street: billingAddress.streetAddress,
  }
}

const discountMetaDataShape = {
  promoCode: '',
  serviceAccommodatorId: null,
  serviceLocationId: null,
  activationDate: null,
  expirationDate: null,
  maxUseCount: 1000000,
  discountUUID: null,
  item: null,
  type: amountTypes.PERCENT,
  discount: 0,
  minimumPurchase: 10,
  maximumDiscount: 0,
  currencyCode: 'USD',
  acceptablePaymentType: 'CASH_OR_CREDIT',
  title: null,
  description: '',
  imageURL: null,
  imageWidth: null,
  imageHeight: null,
  applicableCatalog: null,
  applicableGroup: null,
  applicableItemId: null,
  applicableItemVersion: null,
  applicableePriceId: null,
  applicationType: 'MANUAL_MULTI_USE',
  shareDiscountURL: null,
  onClickURL: null,
  qrCodeURL: null,
  policyString: null,
  applicableItemUUID: null,
  discountPurposeType: null,
  saslTimeZone: 'America/Los_Angeles',
  timeZoneId: 'America/Los_Angeles',
  discountState: 'ACTIVE',
  userLevel: 'DEFAULT'
};

export const transformPromotionToDiscount = (promotion) => {
  return {
    ...discountMetaDataShape,
    type: amountTypes.EXACT,
    priceItem: promotion.priceItem,
    discount: promotion.promoPrice,
    discountUUID: promotion.uuid,
    title: promotion.title,
    applicableItemUUID: promotion.priceItem ? promotion.priceItem.uuid : null,
    serviceAccommodatorId: promotion.serviceAccommodatorId,
    serviceLocationId: promotion.serviceLocationId
  };
};

export const transformLoyaltyToDiscount = (loyalty) => {
  return {
    ...discountMetaDataShape,
    type: amountTypes.EXACT,
    discount: loyalty.promoPrice,
    discountUUID: loyalty.loyaltyUUID,
    priceItem: loyalty.priceItem,
    title: loyalty.title,
    applicableItemUUID: loyalty.priceItem ? loyalty.priceItem.uuid : null,
    serviceAccommodatorId: loyalty.serviceAccommodatorId,
    serviceLocationId: loyalty.serviceLocationId
  };
};

export const formatPhoneNumber = (phoneNumberString) => {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export const extractItemNames = (subOptions, list) => {
  (subOptions || []).map(({ subSubItems }) => {
    return subSubItems.filter((s) => s.isSelected).map((s) => list.push(s.subSubItemName));
  });
};
export const getSubItemsString = (itemOptions) => {
  let list = [];
  if (!itemOptions || typeof itemOptions === 'undefined') return null;
  extractItemNames(itemOptions.subOptions, list);
  extractItemNames(itemOptions.subItemsLeft, list);
  extractItemNames(itemOptions.subItems, list);
  const output = list.join(', ');
  return output ? `(${output})` : '';
};

export const getPaymentTokenFieldsErrors = (paymentTokenError) => {
  if (!Array.isArray(paymentTokenError)) {
    return;
  }

  const errors = paymentTokenError.filter(error => (
    error.error_code === PAYMENT_TOKEN_ERROR.VALIDATION
    || error.error_code === PAYMENT_TOKEN_ERROR.REQUIRED
    || error.error_code === PAYMENT_TOKEN_ERROR.SERVER_REQUIRED
    || error.error_code === PAYMENT_TOKEN_ERROR.SERVER_VALIDATION
  ))
  
  return errors;
}

export const getReadableTime = ({ hours, minutes, timeZone }) => {
  let date = changeTimezone(new Date(), timeZone);
  date.setHours(+hours);
  date.setMinutes(+minutes);

  let options = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return date.toLocaleString('en-US', options);
}

export const roundToTwoPlaces = (num) => {
  // we do num * 10 * 10 because of javascript bug
  // example:
  // 0.575*100 = 57.49999999999999
  // 0.575*10*10 = 57.5
  return Math.round(num * 10 * 10)/100;
}