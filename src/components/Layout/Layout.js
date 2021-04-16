import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Header } from './Header/Header';
import { Drawer } from './Drawer/Drawer';
import { PageLoader } from '../Shared/PageLoader/PageLoader';
import useAuthActions from '../../hooks/user/useAuthActions';
import useBusinessData from '../../hooks/core/useBusinessData';
import useDrawer from '../../hooks/core/useDrawer';
import './Layout.css';
import useGlobalErrorMessage from '../../hooks/core/useGlobalErrorMessage';
import useGetUserSASLSummary from '../../hooks/user/useGetUserSASLSummary';
import useDiscounts from '../../hooks/core/useDiscounts';
import useTableOrder from '../../hooks/order-details/useTableOrder';
import { Page404 } from './Page404/Page404';
import useGetProductItem from '../../hooks/product-item/useGetProductItem';

import { logLocationComponents } from '../../utils/logger';

export const Layout = ({
  isHome = false,
  isProductItem,
  isShoppingCartItem = false,
  pageTitle,
  children
}) => {
  // execute only once (window.load)
  useEffect(() => { window.scrollTo(0, 0) }, []);

  // logLocationComponents(children, window.location);

  const [logIn, logOut] = useAuthActions();
  const [businessData, loading, error] = useBusinessData();
  const [openDrawer, handleOpen, handleClose, handleGoBack] = useDrawer();
  const [user, loyaltyAndOrderHistory] = useGetUserSASLSummary(true);
  const {
    saslName,
    bannerImageURL,
    themeColors,
  } = businessData;

  const [productItem] = useGetProductItem(businessData, isShoppingCartItem);
  useDiscounts(businessData);
  useTableOrder();
  // useGlobalErrorMessage();

  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <Header
        themeColors={themeColors}
        pageTitle={
          (isProductItem || isShoppingCartItem) && productItem && productItem.itemName
            ? productItem.itemName
            : pageTitle
        }
        title={saslName}
        isHome={isHome}
        onBack={isHome ? handleOpen : handleGoBack}
        bannerImageURL={bannerImageURL}/>

      <Drawer
        open={openDrawer}
        onOpen={handleOpen}
        onClose={handleClose}
        user={user}
        onLogin={logIn}
        onLogout={logOut} />

      <div className={`page-content ${isHome ? '' : ' single-page'}`}>
        {error ? ( <Page404 /> ) : (
          <>{React.cloneElement(children, { businessData, user, loyaltyAndOrderHistory })}</>
        )}
      </div>
    </>
  );
};

Layout.propTypes = {
  isHome: PropTypes.bool,
  children: PropTypes.any
};
