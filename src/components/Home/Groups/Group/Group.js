import React from 'react';
import { ProductCard } from '../ProductCard/ProductCard';

export const Group = (props) => { 
  const { id, products, title } = props;

  return (
    <div id={id}>
      <h4 className="title">{title}</h4>
      {(products || []).map((product, index, arr) => {
        return (
          <ProductCard product={product} key={index} />
        )
      })}
    </div>
  )
}