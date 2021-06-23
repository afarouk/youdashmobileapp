export const USER_COOKIE = 'cmx_UID';

export const discountTypes = {
  DISCOUNT: 'discount',
  PROMOTION: 'promotion',
  LOYALTY_STATUS: 'loyaltyStatus',
  GROUP_DISCOUNT: 'groupDiscount'
};

export const amountTypes = {
  PERCENT: 'PERCENT',
  EXACT: 'EXACT',
  AMOUNT: 'AMOUNT'
};

export const PAYMENT_PROCESSOR = {

  UNDEFINED: 'UNDEFINED',
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',

  VANTIV_CHIP: 'VANTIV_CHIP',
  VANTIV_HID: 'VANTIV_HID',
  VANTIV_ECOMMERCE: 'VANTIV_ECOMMERCE',

  TSYS_CHIP: 'TSYS_CHIP',
  TSYS_HID: 'TSYS_HID',
  TSYS_ECOMMERCE: 'TSYS_ECOMMERCE',

  HEARTLAND_CHIP: 'HEARTLAND_CHIP',
  HEARTLAND_HID: 'HEARTLAND_HID',
  HEARTLAND_ECOMMERCE: 'HEARTLAND_ECOMMERCE',

  SHIFT4_CHIP: 'SHIFT4_CHIP',
  SHIFT4_HID: 'SHIFT4_HID',
  SHIFT4_ECOMMERCE: 'SHIFT4_ECOMMERCE',

  NABANCARD_CHIP: 'NABANCARD_CHIP',
  NABANCARD_HID: 'NABANCARD_HID',
  NABANCARD_ECOMMERCE: 'NABANCARD_ECOMMERCE',

  CARDCONNECT_CHIP: 'CARDCONNECT_CHIP',
  CARDCONNECT_HID: 'CARDCONNECT_HID',
  CARDCONNECT_ECOMMERCE: 'CARDCONNECT_ECOMMERCE'

};

export const serviceStatuses = {
  CALL_AHEAD: 'CALL_AHEAD',
  CLOSED: 'CLOSED'
};

export const userSASLSummaryPriorities = {
  NONE: 'NONE',
  NOTIFICATION: 'NOTIFICATION',
  HIGHLIGHTED_ITEM: 'HIGHLIGHTED_ITEM',
  POLL: 'POLL'
};

export const googleMapAPIKey = 'AIzaSyDon847P6x8IUl-pBwSMvvuZd3g2186uhQ';

export const ORDER_STATUS = {
  UNDEFINED: 'UNDEFINED',
  INITIALIZED: 'INITIALIZED',
  PROPOSED: 'PROPOSED',
  IN_PROCESS: 'IN_PROCESS',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED'
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.UNDEFINED]: 'Something went wrong...',
  [ORDER_STATUS.INITIALIZED]: 'In transition',
  [ORDER_STATUS.PROPOSED]: 'Sent to kitchen',
  [ORDER_STATUS.IN_PROCESS]: 'In process',
  [ORDER_STATUS.FULFILLED]: 'Fullfilled',
  [ORDER_STATUS.REJECTED]: 'Rejected',
  [ORDER_STATUS.ARCHIVED]: 'Archived',
}

export const PAYMENT_TOKEN_ERROR = {
  NOT_FOUND: 'NOT_FOUND',
  REQUIRED: 'REQUIRED',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  SERVER_REQUIRED: 'SERVER_REQUIRED',
  SERVER_VALIDATION: 'SERVER_VALIDATION',
}

export const CHECKOUT_MODE = {
  USER_DATA: 'USER_DATA',
  CARD_PAYMENT_PRESTEP: 'CARD_PAYMENT_PRESTEP',
  CARD_PAYMENT: 'CARD_PAYMENT',
}
export const CARD_CONNECT_TOKEN_KEY = 'cardConnectToken';

export const CAYAN_CHECKOUT_KEY = 'CAQIJ8EHM0VHSCC8';
export const CAYAN_CHECKOUT_SCRIPT_URL = 'https://ecommerce.merchantware.net/v1/CayanCheckout.js';
export const GLOBAL_PAYMENTS_KEY = 'pkapi_cert_bXkCMqQvfOTdXnjPGE';
export const GLOBAL_PAYMENTS_SCRIPT_URL = 'https://hps.github.io/token/gp-1.0.0/globalpayments.js';
export const NABANCARD_PUBLIC_KEY = 'eyAidGVybWluYWxQcm9maWxlSWQiOiAxNTY4NyB9';
export const NABANCARD_SCRIPT_URL = 'https://api.cert.nabcommerce.com/1.3/post.js'

export const GOOGLE_RECAPTCHA_KEY = '6LcCXwwUAAAAAO8617hw-277eL5cMAJ5SBsebhWk';
export const GOOGLE_RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js';



export const IS_DEMO = (new URLSearchParams(window.location.search)).get('demo') === 'true';

export const CARD_CONNECT_IFRAME_URL = IS_DEMO
  ? 'https://boltgw-uat.cardconnect.com'
  : 'https://boltgw.cardconnect.com';


export const TABLE_PATH_QUERY_PARAMETER_NAME = 'tablepath';
export const EXPIRATION_DATE_QUERY_PARAMETER_NAME = 'expdt';
export const SIMPLE_ORDER_UUID_QUERY_PARAMETER_NAME = 'souuid';
export const DISCOUNT_UUID_QUERY_PARAMETER_NAME = 'u';
export const DISCOUNT_QUERY_PARAMETER_NAME = 't';
export const DISCOUNT_QUERY_PARAMETER_VALUE = 'd';

export const GREEN_DINING_BLOCK_DURATION_SEC = 10;
export const GREEN_DINING_LOCAL_STORAGE_KEY = 'GREEN_DINING';
export const GREEN_DINING_USED_DEALS_MAX_COUNT = 30; // how many green dining deals are saved in history (we don't want to show green dining deal if it's in the history)

export enum DeliveryType {
  UNDEFINED = 'UNDEFINED',
  DELIVER = 'DELIVER',
  PICK_UP = 'PICK_UP',
  DELIVER_URGENT = 'DELIVER_URGENT',
  TAKEOUT = 'TAKEOUT',
  DINE_IN = 'DINE_IN',
};

export const GENERIC_ERROR_MESSAGE = 'Error... Please try again';
