import React from 'react';

import { Header } from '../../components/Layout/Header/Header';
import { useSelector } from 'react-redux';

export const SuspenseFallback = () => {
  const businessData = useSelector((state) => state.business.data);
  const { saslName, bannerImageURL, themeColors } = businessData;
  const pseudoBack = () => {};
  return (
    <>
      <Header title={' '} isHome={false} onBack={pseudoBack} />
      <div className={`page-content`} />
    </>
  );
};
