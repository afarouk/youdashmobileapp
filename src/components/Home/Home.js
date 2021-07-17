import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '../Shared/Container/Container';
import { Hero } from './Hero/Hero';
import { PickUp } from './PickUp/PickUp';
import { Loyalty } from './Loyalty/Loyalty';
import { Groups } from './Groups/Groups';
import { MyPastOrders } from './MyPastOrders/MyPastOrders';
import { Cart } from './Cart/Cart';
import { LastOrderStatus } from './LastOrderStatus/LastOrderStatus';
import { PriorityCard } from './PriorityCard/PriorityCard';
import { GreenDiningNotification } from './PriorityCard/GreenDiningNotification'

export const Home = ({
  loyaltyAndOrderHistory,
  businessData,
  user,
  shoppingCartItemsCount,
  shoppingCartPrice
}) => {
  const {
    groups,
    saslName,
    saslIcon,
    defaultImageURL,
    urlKey,
    priorityBox,
    itemsById
  } = businessData;
  return (
    <>
      <Hero saslName={saslName} saslIcon={saslIcon} defaultImageURL={defaultImageURL} />
      <Container>
        <div className="greetings-wrapper">
          <div className="greetings-wrapper-inner">
            <GreenDiningNotification />
            <PriorityCard
              itemsById={itemsById}
              priorityBox={priorityBox}
              user={user}
              loyaltyAndOrderHistory={loyaltyAndOrderHistory}
            />
            <PickUp user={user} businessData={businessData} />
          </div>
        </div>
        {user && loyaltyAndOrderHistory && (
          <Loyalty loyaltyAndOrderHistory={loyaltyAndOrderHistory} />
        )}
        {/* {user && loyaltyAndOrderHistory && (
          <LastOrderStatus loyaltyAndOrderHistory={loyaltyAndOrderHistory} />
        )} */}
        {/* {user && <MyPastOrders urlKey={urlKey} />} */}
        <Groups groups={groups} />
        {shoppingCartItemsCount ? (
          <Cart itemsCount={shoppingCartItemsCount} price={shoppingCartPrice} />
        ) : null}
      </Container>
    </>
  );
};

Home.propTypes = {
  groups: PropTypes.array,
  saslName: PropTypes.string,
  urlKey: PropTypes.string,
  user: PropTypes.object,
  shoppingCartItemsCount: PropTypes.number,
  shoppingCartPrice: PropTypes.number
};
