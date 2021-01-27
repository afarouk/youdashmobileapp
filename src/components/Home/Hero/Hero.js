import React, { memo } from 'react';
import PropTypes from 'prop-types';

import './Hero.css';
import { ImagePlaceholder } from '../../Shared/ImagePlaceholder/ImagePlaceholder';
export const Hero = memo(({ defaultImageURL, saslIcon, title = '' }) => (
  <div className="hero">
    <img src={saslIcon} alt="" className="hero-icon" />
    <ImagePlaceholder>
      <img src={defaultImageURL} alt={title} className="hero-bg" />
    </ImagePlaceholder>
  </div>
));

Hero.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  iconUrl: PropTypes.string
};
