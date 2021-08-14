import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { routes } from '../config/routes';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { SuspenseFallback } from './SuspenseFallback';

import HomePage from '../pages';
import { CheckoutIFrameRedirect } from '../components/Checkout/CheckoutIFrameRedirect';

// const HomePage = lazy(() => import(/* webpackChunkName: 'Home'*/ '../pages/../pages'));
const OrderDetailsPage = lazy(() => import(/* webpackChunkName: 'OrderDetails'*/ '../pages/order-details'));
const OrderHistoryPage = lazy(() => import(/* webpackChunkName: 'OrderHistory'*/ '../pages/order-history'));
const ProductItemPage = lazy(() => import(/* webpackChunkName: 'ProductItem'*/ '../pages/product-item'));
const ShoppingCartItemPage = lazy(() => import(/* webpackChunkName: 'ShoppingCartItem'*/ '../pages/shopping-cart-item'));
const UserSettingsPage = lazy(() => import(/* webpackChunkName: 'UserSettings'*/ '../pages/user-settings'));
const OrderStatusPage = lazy(() => import(/* webpackChunkName: 'OrderStatus'*/ '../pages/order-status'));
const PollPage = lazy(() => import(/* webpackChunkName: 'Poll'*/ '../pages/poll'));
const SignUpPage = lazy(() => import(/* webpackChunkName: 'SignUp'*/ '../pages/sign-up'));
const LoginPage = lazy(() => import(/* webpackChunkName: 'Login'*/ '../pages/login'));
const ReservationPage = lazy(() => import(/* webpackChunkName: 'Reservation'*/ '../pages/reservation'));
const ReservationDetailsPage = lazy(() => import(/* webpackChunkName: 'Reservation'*/ '../pages/reservation-details'));

export const Routes = ({ user }) => {
  return (
    <Router>
      <Suspense fallback={<SuspenseFallback />}>
        <Switch>
          <ProtectedRoute
            path="/:businessUrlKey/order-history"
            component={OrderHistoryPage}
            pageTitle={routes.orderHistory.title}
            user={user}
          />

          <ProtectedRoute
            path="/:businessUrlKey/user-settings"
            component={UserSettingsPage}
            pageTitle={routes.userSettings.title}
            user={user}
          />

          <ProtectedRoute
            path="/:businessUrlKey/order-status/:orderUUID"
            component={OrderStatusPage}
            pageTitle={routes.orderStatus.title}
            user={user}
          />

          <PublicRoute
            pageTitle={routes.poll.title}
            path="/:businessUrlKey/poll/:contestUUID"
            component={PollPage}
          />

          <PublicRoute
            path="/:businessUrlKey/reservation"
            component={ReservationPage}
            pageTitle={routes.reservation.title}
          />

          <PublicRoute
            path="/:businessUrlKey/reservation-details"
            component={ReservationDetailsPage}
            pageTitle={routes.reservationDetails.title}
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
          {/* <PublicRoute
            path="/:businessUrlKey/login"
            component={LoginPage}
            pageTitle={routes.login.title}
          /> */}
          <PublicRoute
            path="/:businessUrlKey/shopping-cart/:itemIndex"
            component={ShoppingCartItemPage}
            isShoppingCartItem
          />

          <Route
            path="/:businessUrlKey/checkout-redirect"
            component={CheckoutIFrameRedirect}
          />

          <PublicRoute
            path="/:businessUrlKey/p/:productId"
            component={ProductItemPage}
            isProductItem
          />

          <PublicRoute
            path="/:businessUrlKey"
            component={HomePage}
            isHome
          />
        </Switch>
      </Suspense>
    </Router>
  );
}
