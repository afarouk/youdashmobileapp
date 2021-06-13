import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';
import { businessReducer } from './slices/business';

import { authReducer } from './slices/auth';
import { loyaltyAndOrderHistoryReducer } from './slices/loyaltyAndOrderHistory';
import { shoppingCartReducer } from './slices/shoppingCart';
import { globalErrorReducer } from './slices/globalError';
import { ccReducer } from './slices/cc';
import { creditCardPrestepFormReducer } from './slices/creditCardPrestepForm';
import { cardConnectIframeReducer } from './slices/cardConnectIframe';
import { heartlandReducer } from './slices/heartland';
import { nabancardReducer } from './slices/nabancard';
import { greenDiningReducer } from './slices/greenDiningSlice';

const middleware = [
  ...getDefaultMiddleware()
  /*YOUR CUSTOM MIDDLEWARES HERE*/
];

const rootReducer = combineReducers({
  business: businessReducer,
  auth: authReducer,
  shoppingCart: shoppingCartReducer,
  loyaltyAndOrderHistory: loyaltyAndOrderHistoryReducer,
  globalError: globalErrorReducer,
  cc: ccReducer,
  creditCardPrestepForm: creditCardPrestepFormReducer,
  cardConnectIframe: cardConnectIframeReducer,
  heartland: heartlandReducer,
  nabancard: nabancardReducer,
  greenDining: greenDiningReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppState = ReturnType<typeof rootReducer>;

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
