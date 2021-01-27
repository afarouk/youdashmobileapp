import React from 'react';
import PropTypes from 'prop-types';
import {MenuIcon} from '../../Shared/Icons/Icons';
import {ArrowLeftIcon} from "../../Shared/Icons/Icons";
import './Header.css';

const ActionIcon = ({ onBack, isHome }) => (
  <div onClick={onBack} className="action-icon">
    {isHome ? <MenuIcon /> : <ArrowLeftIcon />}
  </div>
);
export const Header = ({
  title,
  pageTitle,
  isHome = false,
  onBack,
  bannerImageURL,
  themeColors
}) => {
  return (
    <header className={`page-header`} id="header">
      <ActionIcon onBack={onBack} isHome={isHome} />
      <div className="page-title">
        {pageTitle ? (
          pageTitle
        ) : bannerImageURL ? (
          <img src={bannerImageURL} alt={title} />
        ) : (
          title
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isHome: PropTypes.bool,
  onBack: PropTypes.func
};
