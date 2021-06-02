import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { businessReducer } from './slices/business';

import { authReducer } from './slices/auth';
import { loyaltyAndOrderHistoryReducer } from './slices/loyaltyAndOrderHistory';
import { shoppingCartReducer } from './slices/shoppingCart';
import { globalErrorReducer } from './slices/globalError';
import { ccReducer } from './slices/cc';
import { creditCardPrestepFormReducer } from './slices/creditCardPrestepForm';
import { cardConnectIframeReducer } from './slices/cardConnectIframe';
import { heartlandReducer } from './slices/heartland';

const middleware = [
  ...getDefaultMiddleware()
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];

export const store = configureStore({
  reducer: {
    business: businessReducer,
    auth: authReducer,
    shoppingCart: shoppingCartReducer,
    loyaltyAndOrderHistory: loyaltyAndOrderHistoryReducer,
    globalError: globalErrorReducer,
    cc: ccReducer,
    creditCardPrestepForm: creditCardPrestepFormReducer,
    cardConnectIframe: cardConnectIframeReducer,
    heartland: heartlandReducer,
  },
  middleware
});
