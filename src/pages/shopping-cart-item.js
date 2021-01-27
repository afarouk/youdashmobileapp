import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { ProductItem } from '../components/ProductItem/ProductItem';
import useProductItem from '../hooks/product-item/useProductItem';
import { editCartItem } from '../redux/slices/shoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import useGetProductItem from '../hooks/product-item/useGetProductItem';

const ShoppingCartItemPage = ({ businessData }) => {
  const [item] = useGetProductItem(businessData, true);

  const { businessUrlKey, itemIndex } = useParams();
  const { search } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [
    productItem,
    handleSubItemCheckboxChange,
    handleQuantityPlus,
    handleQuantityMinus,
    handleCommentsChange,
    handleItemVersionChange
  ] = useProductItem(item);

  const handleEditCartItem = () => {
    dispatch(
      editCartItem({
        item: productItem,
        itemIndex
      })
    );
    history.push(`/${businessUrlKey}/order-details${search}`);
  };

  return productItem ? (
    <ProductItem
      isShoppingCart
      productItem={productItem}
      onCheckboxChange={handleSubItemCheckboxChange}
      onQtyPlus={handleQuantityPlus}
      onQtyMinus={handleQuantityMinus}
      addToCart={handleEditCartItem}
      onTextChange={handleCommentsChange}
      onItemVersionChange={handleItemVersionChange}
    />
  ) : null;
};

export default ShoppingCartItemPage;
