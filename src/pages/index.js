import React from 'react';
import { Home } from '../components/Home/Home';
import { useSelector } from 'react-redux';

const HomePage = ({ businessData, user, loyaltyAndOrderHistory }) => {
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const shoppingCartPrice = useSelector((state) => state.shoppingCart.priceSubTotal);
  return (
    <Home
      shoppingCartItemsCount={shoppingCartItems?.length}
      shoppingCartPrice={shoppingCartPrice}
      user={user}
      businessData={businessData}
      loyaltyAndOrderHistory={loyaltyAndOrderHistory}
    />
  );
};
export default HomePage;