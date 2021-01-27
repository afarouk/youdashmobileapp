import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import HomePage from '../pages';
// import ProductItemPage from '../pages/product-item';
// import OrderHistoryPage from '../pages/order-history';
// import OrderDetailsPage from '../pages/order-details';
import { ProtectedRoute } from './ProtectedRoute/ProtectedRoute';
import { PublicRoute } from './PublicRoute/PublicRoute';
// import ShoppingCartItemPage from '../pages/shopping-cart-item';
// import  UserSettingsPage  from '../pages/user-settings';
// import OrderStatusPage from '../pages/order-status';
// import OrderDetailsPage from '../pages/order-details';
// import SignUpPage from '../pages/sign-up';
// import LoginPage from '../pages/login';
import { CheckoutIFrameRedirect } from '../components/Checkout/CheckoutIFrameRedirect';
import { SuspenseFallback } from './SuspenseFallback/SuspenseFallback';
import { routes } from '../config/routes';

// const HomePage = lazy(() => import(/* webpackChunkName: 'Home'*/ '../pages/../pages'));
const OrderDetailsPage = lazy(() =>
  import(/* webpackChunkName: 'OrderDetails'*/ '../pages/order-details')
);
const OrderHistoryPage = lazy(() =>
  import(/* webpackChunkName: 'OrderHistory'*/ '../pages/order-history')
);
const ProductItemPage = lazy(() =>
  import(/* webpackChunkName: 'ProductItem'*/ '../pages/product-item')
);
const ShoppingCartItemPage = lazy(() =>
  import(/* webpackChunkName: 'ShoppingCartItem'*/ '../pages/shopping-cart-item')
);
const UserSettingsPage = lazy(() =>
  import(/* webpackChunkName: 'UserSettings'*/ '../pages/user-settings')
);
const OrderStatusPage = lazy(() =>
  import(/* webpackChunkName: 'OrderStatus'*/ '../pages/order-status')
);
const PollPage = lazy(() => import(/* webpackChunkName: 'Poll'*/ '../pages/poll'));
const SignUpPage = lazy(() => import(/* webpackChunkName: 'SignUp'*/ '../pages/sign-up'));
const LoginPage = lazy(() => import(/* webpackChunkName: 'Login'*/ '../pages/login'));

export const Routes = ({ user }) => (
  <Router>
    <Suspense fallback={<SuspenseFallback />}>
      <Switch>
        <ProtectedRoute
          pageTitle={routes.orderHistory.title}
          path="/:businessUrlKey/order-history"
          user={user}
          component={OrderHistoryPage}
        />
        <ProtectedRoute
          pageTitle={routes.userSettings.title}
          path="/:businessUrlKey/user-settings"
          user={user}
          component={UserSettingsPage}
        />
        <ProtectedRoute
          pageTitle={routes.orderStatus.title}
          path="/:businessUrlKey/order-status/:orderUUID"
          user={user}
          component={OrderStatusPage}
        />
        <PublicRoute
          pageTitle={routes.poll.title}
          path="/:businessUrlKey/poll/:contestUUID"
          component={PollPage}
        />
        <PublicRoute
          path="/:businessUrlKey/order-details"
          component={OrderDetailsPage}
          pageTitle={routes.orderDetails.title}
        />

        <PublicRoute
          path="/:businessUrlKey/sign-up"
          component={SignUpPage}
          pageTitle={routes.signUp.title}
        />
        <PublicRoute
          path="/:businessUrlKey/login"
          component={LoginPage}
          pageTitle={routes.login.title}
        />
        <PublicRoute
          path="/:businessUrlKey/shopping-cart/:itemIndex"
          component={ShoppingCartItemPage}
          isShoppingCartItem
        />
        <Route path="/:businessUrlKey/checkout-redirect" component={CheckoutIFrameRedirect} />
        <PublicRoute
          path="/:businessUrlKey/p/:productId"
          component={ProductItemPage}
          isProductItem
        />
        <PublicRoute path="/:businessUrlKey" isHome component={HomePage} />
      </Switch>
    </Suspense>
  </Router>
);
