import React from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from '../../../redux/store';
import { MenuIcon } from '../../Shared/Icons/Icons';
import { ArrowLeftIcon } from "../../Shared/Icons/Icons";
import './Header.css';

const ActionIcon = ({ onBack, isHome }: any) => (
  <div onClick={onBack} className="action-icon">
    {isHome ? <MenuIcon /> : <ArrowLeftIcon />}
  </div>
);

type HeaderProps = {
  title: string,
  pageTitle?: string,
  isHome: boolean,
  onBack: Function,
  bannerImageURL?: string,
}

export const Header: React.FC<HeaderProps> = ({
  title,
  pageTitle,
  isHome = false,
  onBack,
  bannerImageURL,
}) => {
  const tableDetails = useSelector(state => state.shoppingCart.tableDetails);

  const orderDetailsRouteInfo = useRouteMatch({
    path: '/:businessUrlKey/order-details',
    strict: true,
    sensitive: true
  });

  let titleElement = pageTitle 
    ? pageTitle
    : bannerImageURL 
      ? <img src={bannerImageURL} alt={title} />
      : title;

  if (orderDetailsRouteInfo && tableDetails) {
    titleElement = (
      <>
        {titleElement}
        <span className="page-header__table-info">
          Table: {tableDetails.tableId}
        </span>
      </>
    );
  }  
  
  return (
    <header className="page-header" id="header">
      <ActionIcon onBack={onBack} isHome={isHome} />
      <div className="page-title">
        {titleElement}
      </div>
    </header>
  );
};
