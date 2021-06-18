import React from 'react';
import { Home } from '../components/Home/Home';
import { useSelector } from 'react-redux';
import { selectSubTotalWithoutDiscounts } from '../redux/selectors/shoppingCartSelectors';

const HomePage = ({ businessData, user, loyaltyAndOrderHistory }) => {
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const shoppingCartPrice = useSelector((state) => state.shoppingCart.priceSubTotal);
  const shoppingCartPriceWithoutDiscounts = useSelector(selectSubTotalWithoutDiscounts);

  return (
    <Home
      shoppingCartItemsCount={shoppingCartItems?.length}
      shoppingCartPrice={shoppingCartPriceWithoutDiscounts}
      user={user}
      businessData={businessData}
      loyaltyAndOrderHistory={loyaltyAndOrderHistory}
    />
  );
};
export default HomePage;