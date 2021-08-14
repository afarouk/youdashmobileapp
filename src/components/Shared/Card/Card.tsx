import React from 'react';

import './Card.css';

export const Card: React.FC<any> = ({ children, className = '', ...rest }) => (
  <div className={`card p-default bg-secondary ${className}`} {...rest}>{children}</div>
);
