import React from 'react';
import { Button } from 'antd';
import { handleNativeShare } from '../../utils/helpers';
import { ShareIcon } from '../Shared/Icons/ShareIcon';
export const Share = () => {
  const shareData = {
    title: 'YouDash French Bakery',
    text: 'YouDash French Bakery - the best bakery in the world!',
    url: 'https://youdash.co/french-bakery'
  };
  const handleShare = () => handleNativeShare(shareData);
  return (
    <div className="share-product">
      <Button size="large" icon={<ShareIcon />} onClick={handleShare}>
        <span className="font-size-sm">
          Share <br /> Restaurant
        </span>
      </Button>
      <Button size="large" icon={<ShareIcon />} onClick={handleShare}>
        <span className="font-size-sm">
          Share item <br /> with a friend
        </span>
      </Button>
    </div>
  );
};
