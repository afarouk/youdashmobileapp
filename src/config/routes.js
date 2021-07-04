export const routes = {
  home: {
    path: '/',
    title: 'Home'
  },
  signUp: {
    path: '/sign-up',
    title: 'Sign up'
  },
  productItem: {
    path: '/:productId'
  },
  trackOrder: {
    path: '/order-status/123',
    title: 'Order Status',
    authRequired: true
  },
  orderHistory: {
    path: '/order-history',
    title: 'Order History',
    authRequired: true
  },
  orderDetails: {
    path: '/order-details',
    title: 'Order Details'
  },
  orderStatus: {
    path: '/order-status',
    title: 'Order Status'
  },
  poll: {
    path: '/poll',
    title: 'Poll'
  },
  userSettings: {
    path: '/user-settings',
    title: 'My Settings',
    authRequired: true
  },
  payment: {
    path: '/payment',
    title: 'Payment'
  },
  terms: {
    target: '_blank',
    url: 'https://chalkboardstoday.com/termsandconditions',
    title: 'Terms & Conditions'
  },
  // help: {
  //   path: '/help',
  //   title: 'Help'
  // },
  login: {
    title: 'Login',
    path: '/login'
  }
};
