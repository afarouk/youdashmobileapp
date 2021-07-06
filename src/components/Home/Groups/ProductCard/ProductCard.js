import React from 'react';
import PropTypes from 'prop-types';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getMediaImageUrl } from '../../../../utils/helpers';
// import { ImagePlaceholder } from '../../../Shared/ImagePlaceholder/ImagePlaceholder';

import './ProductCard.css';

export const ProductCard = ({ product, isCard = true }) => {
  const { itemId, uuid, itemName, mediaURLs, shortDescription, longDescription, price } = product;
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const imageUrl = getMediaImageUrl(mediaURLs);
  let styleProps = {};
  if (imageUrl) {
    styleProps.backgroundImage = `url('${getMediaImageUrl(mediaURLs)}')`;
    styleProps.backgroundPosition = 'center';
  }

  return (
    <Link
      to={`/${businessUrlKey}/p/${uuid}${search}`}
      className={`${isCard ? 'card' : ''} group__product-card bg-secondary p-default`}
    >
      {/* <ImagePlaceholder>
        <img src={getMediaImageUrl(mediaURLs)} alt={itemName} />
      </ImagePlaceholder>*/}
      <div className="group__product-card-image" style={styleProps} />
      <div className="group__product-card-content">
        <div className="group__product-card-title font-size-md">
          <h3>{itemName}</h3>
          <div className="primary-text group__product-card-price">${price.toFixed(2)}</div>
        </div>
        <div className="group__product-card-description">{shortDescription || longDescription}</div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    itemName: PropTypes.string,
    mediaURLs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    shortDescription: PropTypes.any,
    longDescription: PropTypes.any,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};
