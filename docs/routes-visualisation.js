/*
OrderDetailsPage = pages/order-details
OrderHistoryPage = pages/order-history
ProductItemPage = pages/product-item
ShoppingCartItemPage = pages/shopping-cart-item
UserSettingsPage = pages/user-settings
OrderStatusPage = pages/order-status
PollPage = pages/poll
SignUpPage = pages/sign-up
LoginPage = pages/login
*/
<Switch>
  <PublicRoute
    path="/:businessUrlKey"
    component={/* import HomePage from '../pages'; */}/>
  <PublicRoute
    path="/:businessUrlKey/order-details"
    component={"pages/order-details"}/>
  <PublicRoute
    path="/:businessUrlKey/p/:productId"
    component={"pages/product-item"}/>
  <PublicRoute
    path="/:businessUrlKey/poll/:contestUUID"
    component={"pages/poll"}/>
  <PublicRoute
    path="/:businessUrlKey/sign-up"
    component={"pages/sign-up"}/>
  <PublicRoute
    path="/:businessUrlKey/login"
    component={"pages/login"}/>
  <PublicRoute
    path="/:businessUrlKey/shopping-cart/:itemIndex"
    component={"pages/shopping-cart-item"}/>

  <ProtectedRoute
    path="/:businessUrlKey/user-settings"
    component={"pages/user-settings"}/>
  <ProtectedRoute
    path="/:businessUrlKey/order-status/:orderUUID"
    component={"pages/order-status"}/>
  <ProtectedRoute
    path="/:businessUrlKey/order-history"
    component={"pages/order-history"}/>

  <Route
    path="/:businessUrlKey/checkout-redirect"
    component={CheckoutIFrameRedirect}/>

</Switch>
