import React from 'react';

import { Spin } from 'antd';

import './LoadingElement.css'


type Props = {
  loading: boolean,
  className?: string,
  loadingFallback?: JSX.Element
}

export const LoadingElement: React.FC<Props> = ({ 
  children, 
  loading, 
  className,
  loadingFallback, 
  ...rest 
}) => {

  const loader = (
    <div className="app-loading-element__loader-container app-loading-element__progress">
      <Spin size="default" />
    </div>
  )

  let content = loadingFallback && loading ? loadingFallback : children;

  return (
    <div className={`app-loading-element ${loading ? 'app-loading-element--loading' : ''} ${className || ''}`} {...rest}>
      {content}
      {loading && loader}
    </div>
  )
}